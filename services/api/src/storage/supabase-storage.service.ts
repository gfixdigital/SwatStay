import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";

export type StorageFile = { buffer: Buffer; originalname: string; mimetype: string; size: number };

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly client?: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>("SUPABASE_URL");
    const serviceRoleKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = this.config.get<string>("SUPABASE_STORAGE_BUCKET", "swatstay-files");
    if (url && serviceRoleKey) this.client = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
    else this.logger.warn("Supabase Storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before file uploads.");
  }

  async ensureBucket() {
    if (!this.client) return false;
    const { error } = await this.client.storage.createBucket(this.bucket, { public: false, fileSizeLimit: "5242880", allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf", "image/webp"] });
    if (error && !/already exists|duplicate/i.test(error.message)) throw new ServiceUnavailableException(`Unable to prepare Supabase Storage bucket: ${error.message}`);
    return true;
  }

  async upload(prefix: string, file: StorageFile) {
    if (!this.client) throw new ServiceUnavailableException("Secure file storage is not configured yet.");
    await this.ensureBucket();
    const extension = extname(file.originalname).toLowerCase() || ".bin";
    const path = `${prefix}/${randomUUID()}${extension}`;
    const { error } = await this.client.storage.from(this.bucket).upload(path, file.buffer, { contentType: file.mimetype, cacheControl: "3600", upsert: false });
    if (error) throw new ServiceUnavailableException(`Unable to upload file: ${error.message}`);
    return path;
  }

  async createSignedUrl(path: string, expiresIn = 600) {
    if (!this.client || !path) return null;
    const { data, error } = await this.client.storage.from(this.bucket).createSignedUrl(path, expiresIn);
    if (error) throw new ServiceUnavailableException(`Unable to create file preview link: ${error.message}`);
    return data.signedUrl;
  }
}
