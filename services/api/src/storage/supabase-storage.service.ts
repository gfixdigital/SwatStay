import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

export type StorageFile = { buffer: Buffer; originalname: string; mimetype: string; size: number };

type StorageMode = "supabase" | "local";

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly client?: SupabaseClient;
  private readonly bucket: string;
  private readonly mode: StorageMode;
  private readonly localDir: string;
  private readonly localPublicUrl: string;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>("SUPABASE_URL");
    const serviceRoleKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = this.config.get<string>("SUPABASE_STORAGE_BUCKET", "swatstay-files");
    this.localDir = this.config.get<string>("LOCAL_STORAGE_DIR", join(process.cwd(), "uploads"));
    this.localPublicUrl = this.config.get<string>("LOCAL_STORAGE_PUBLIC_URL", "http://localhost:4000");

    const supabaseConfigured = Boolean(url && serviceRoleKey && url !== "https://YOUR_PROJECT_REF.supabase.co");
    if (supabaseConfigured) {
      this.client = createClient(url!, serviceRoleKey!, { auth: { persistSession: false, autoRefreshToken: false } });
      this.mode = "supabase";
    } else {
      this.mode = "local";
      mkdirSync(this.localDir, { recursive: true });
      this.logger.warn("Supabase Storage is not configured. Using local file storage under ./uploads.");
    }
  }

  get storageMode(): StorageMode {
    return this.mode;
  }

  async ensureBucket() {
    if (this.mode === "local") return true;
    if (!this.client) return false;
    const { error } = await this.client.storage.createBucket(this.bucket, {
      public: false,
      fileSizeLimit: "5242880",
      allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf", "image/webp"],
    });
    if (error && !/already exists|duplicate/i.test(error.message))
      throw new ServiceUnavailableException(`Unable to prepare Supabase Storage bucket: ${error.message}`);
    return true;
  }

  async upload(prefix: string, file: StorageFile) {
    if (this.mode === "local") return this.localUpload(prefix, file);
    if (!this.client) throw new ServiceUnavailableException("Secure file storage is not configured yet.");
    await this.ensureBucket();
    const extension = extname(file.originalname).toLowerCase() || ".bin";
    const path = `${prefix}/${randomUUID()}${extension}`;
    const { error } = await this.client.storage.from(this.bucket).upload(path, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new ServiceUnavailableException(`Unable to upload file: ${error.message}`);
    return path;
  }

  async createSignedUrl(path: string | null, expiresIn = 600) {
    if (this.mode === "local") return this.localSignedUrl(path);
    if (!this.client || !path) return null;
    const { data, error } = await this.client.storage.from(this.bucket).createSignedUrl(path, expiresIn);
    if (error) throw new ServiceUnavailableException(`Unable to create file preview link: ${error.message}`);
    return data.signedUrl;
  }

  async listMedia() {
    if (this.mode === "local") return this.localListMedia();
    if (!this.client) throw new ServiceUnavailableException("Secure file storage is not configured yet.");
    const { data, error } = await this.client.storage.from(this.bucket).list("media", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw new ServiceUnavailableException(`Unable to list media: ${error.message}`);
    return Promise.all(
      (data ?? [])
        .filter((item) => item.id)
        .map(async (item) => {
          const path = `media/${item.name}`;
          return {
            id: path,
            name: item.name,
            path,
            size: item.metadata?.size ?? 0,
            mimeType: item.metadata?.mimetype ?? "application/octet-stream",
            createdAt: item.created_at,
            url: await this.createSignedUrl(path),
          };
        }),
    );
  }

  async delete(path: string) {
    if (this.mode === "local") return this.localDelete(path);
    if (!this.client) throw new ServiceUnavailableException("Secure file storage is not configured yet.");
    if (!path.startsWith("media/")) throw new ServiceUnavailableException("Only media files can be deleted from this endpoint.");
    const { error } = await this.client.storage.from(this.bucket).remove([path]);
    if (error) throw new ServiceUnavailableException(`Unable to delete media: ${error.message}`);
    return { path };
  }

  private localPath(path: string) {
    return join(this.localDir, ...path.split(/[\\/]/));
  }

  private localUpload(prefix: string, file: StorageFile) {
    const dir = join(this.localDir, ...prefix.split(/[\\/]/));
    mkdirSync(dir, { recursive: true });
    const extension = extname(file.originalname).toLowerCase() || ".bin";
    const path = `${prefix}/${randomUUID()}${extension}`;
    writeFileSync(this.localPath(path), file.buffer);
    return path;
  }

  private localSignedUrl(path: string | null) {
    if (!path) return null;
    if (!existsSync(this.localPath(path))) return null;
    return `${this.localPublicUrl}/storage/${path}`;
  }

  private localListMedia() {
    const dir = join(this.localDir, "media");
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const path = `media/${entry.name}`;
        return {
          id: path,
          name: entry.name,
          path,
          size: 0,
          mimeType: "application/octet-stream",
          createdAt: null,
          url: `${this.localPublicUrl}/storage/${path}`,
        };
      });
  }

  private localDelete(path: string) {
    if (!path.startsWith("media/")) throw new ServiceUnavailableException("Only media files can be deleted from this endpoint.");
    const full = this.localPath(path);
    if (!existsSync(full)) throw new NotFoundException("File not found");
    rmSync(full);
    return { path };
  }
}