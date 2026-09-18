import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SupabaseStorageService } from "../storage/supabase-storage.service";

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService, private readonly storage: SupabaseStorageService) {}

  async list() { const items = await this.prisma.package.findMany({ where: { isActive: true }, include: { destination: true, items: true }, orderBy: { createdAt: "desc" } }); return Promise.all(items.map((item) => this.resolveMedia(item))); }

  async getBySlug(slug: string) {
    const item = await this.prisma.package.findFirst({ where: { slug, isActive: true }, include: { destination: true, items: true } });
    if (!item) throw new NotFoundException("Package not found");
    return this.resolveMedia(item);
  }

  async destinations() { const items = await this.prisma.destination.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }); return Promise.all(items.map((item) => this.resolveMedia(item))); }

  private async resolveMedia<T extends { imageUrl: string | null; gallery: unknown }>(item: T) { const imageUrl = item.imageUrl?.startsWith("media/") ? await this.storage.createSignedUrl(item.imageUrl, 3600) : item.imageUrl; const gallery = Array.isArray(item.gallery) ? await Promise.all(item.gallery.map((value) => typeof value === "string" && value.startsWith("media/") ? this.storage.createSignedUrl(value, 3600) : value)) : item.gallery; return { ...item, imageUrl, gallery }; }
}
