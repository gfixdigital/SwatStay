import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { CreateDestinationDto } from "./dto/create-destination.dto";
import { CreatePackageDto } from "./dto/create-package.dto";
import { SupabaseStorageService } from "../storage/supabase-storage.service";
import { ProviderStatus } from "@prisma/client";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService, private readonly storage: SupabaseStorageService) {}

  async getProviderMedia(providerId: string) {
    const provider = await this.prisma.provider.findUnique({ where: { id: providerId }, select: { id: true, media: true } });
    if (!provider) throw new NotFoundException("Provider not found");
    const media = this.normalizeProviderMedia(provider.media);
    return { ...media, coverImageUrl: await this.storage.createSignedUrl(media.coverImage), galleryUrls: await Promise.all(media.gallery.map((path) => this.storage.createSignedUrl(path))), documentUrls: await Promise.all(media.documents.map((path) => this.storage.createSignedUrl(path))) };
  }

  async updateProviderMedia(actorId: string, providerId: string, input: { coverImage?: string | null; gallery?: string[]; documents?: string[] }) {
    const provider = await this.prisma.provider.findUnique({ where: { id: providerId }, select: { id: true } });
    if (!provider) throw new NotFoundException("Provider not found");
    const media = { coverImage: input.coverImage ?? null, gallery: input.gallery ?? [], documents: input.documents ?? [] };
    const invalid = [media.coverImage, ...media.gallery, ...media.documents].filter((path): path is string => Boolean(path)).some((path) => !path.startsWith("media/"));
    if (invalid) throw new BadRequestException("Provider media must come from the private media library");
    const updated = await this.prisma.provider.update({ where: { id: providerId }, data: { media: media as Prisma.InputJsonValue }, select: { id: true, media: true } });
    await this.audit.record("PROVIDER_MEDIA_UPDATED", "Provider", providerId, actorId, media as Prisma.InputJsonValue);
    return this.getProviderMedia(updated.id);
  }

  private normalizeProviderMedia(value: unknown) { const media = value && typeof value === "object" ? value as { coverImage?: unknown; gallery?: unknown; documents?: unknown } : {}; return { coverImage: typeof media.coverImage === "string" ? media.coverImage : null, gallery: Array.isArray(media.gallery) ? media.gallery.filter((path): path is string => typeof path === "string") : [], documents: Array.isArray(media.documents) ? media.documents.filter((path): path is string => typeof path === "string") : [] }; }

  listDestinations() { return this.prisma.destination.findMany({ orderBy: { name: "asc" } }); }

  listProviders() { return this.prisma.provider.findMany({ orderBy: { createdAt: "desc" } }); }

  async updateProviderStatus(actorId: string, id: string, status: ProviderStatus) { const existing = await this.prisma.provider.findUnique({ where: { id }, select: { userId: true } }); if (!existing) throw new NotFoundException("Provider not found"); const provider = await this.prisma.$transaction(async (tx) => { const updated = await tx.provider.update({ where: { id }, data: { status } }); if (existing.userId) await tx.user.update({ where: { id: existing.userId }, data: { isActive: status === ProviderStatus.APPROVED } }); return updated; }); await this.audit.record("PROVIDER_STATUS_UPDATED", "Provider", id, actorId, { status, accountActivated: status === ProviderStatus.APPROVED }); return provider; }

  async createDestination(actorId: string, input: CreateDestinationDto) {
    const exists = await this.prisma.destination.findUnique({ where: { slug: input.slug } });
    if (exists) throw new BadRequestException("Destination slug already exists");
    const destination = await this.prisma.destination.create({ data: this.destinationData(input) });
    await this.audit.record("DESTINATION_CREATED", "Destination", destination.id, actorId, { slug: destination.slug });
    return destination;
  }

  async updateDestination(actorId: string, id: string, input: CreateDestinationDto) { const existing = await this.prisma.destination.findUnique({ where: { id } }); if (!existing) throw new NotFoundException("Destination not found"); const duplicate = await this.prisma.destination.findFirst({ where: { slug: input.slug, NOT: { id } } }); if (duplicate) throw new BadRequestException("Destination slug already exists"); const destination = await this.prisma.destination.update({ where: { id }, data: this.destinationData(input) }); await this.audit.record("DESTINATION_UPDATED", "Destination", id, actorId, { slug: destination.slug }); return destination; }
  async setDestinationActive(actorId: string, id: string, isActive: boolean) { const destination = await this.prisma.destination.update({ where: { id }, data: { isActive } }); await this.audit.record(isActive ? "DESTINATION_ACTIVATED" : "DESTINATION_ARCHIVED", "Destination", id, actorId); return destination; }

  listPackages() { return this.prisma.package.findMany({ include: { destination: true, items: true }, orderBy: { createdAt: "desc" } }); }

  async createPackage(actorId: string, input: CreatePackageDto) {
    const destination = await this.prisma.destination.findUnique({ where: { id: input.destinationId } });
    if (!destination) throw new NotFoundException("Destination not found");
    const exists = await this.prisma.package.findUnique({ where: { slug: input.slug } });
    if (exists) throw new BadRequestException("Package slug already exists");
    const pkg = await this.prisma.package.create({ data: { ...this.packageData(input), destinationId: input.destinationId, items: { create: input.items } }, include: { destination: true, items: true } });
    await this.audit.record("PACKAGE_CREATED", "Package", pkg.id, actorId, { slug: pkg.slug, destinationId: pkg.destinationId });
    return pkg;
  }

  async updatePackage(actorId: string, id: string, input: CreatePackageDto) {
    const existing = await this.prisma.package.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Package not found");
    const destination = await this.prisma.destination.findUnique({ where: { id: input.destinationId } });
    if (!destination) throw new NotFoundException("Destination not found");
    const pkg = await this.prisma.$transaction(async (tx) => { await tx.packageItem.deleteMany({ where: { packageId: id } }); return tx.package.update({ where: { id }, data: { ...this.packageData(input), destinationId: input.destinationId, items: { create: input.items } }, include: { destination: true, items: true } }); });
    await this.audit.record("PACKAGE_UPDATED", "Package", id, actorId, { slug: pkg.slug });
    return pkg;
  }

  async setActive(actorId: string, id: string, isActive: boolean) { const pkg = await this.prisma.package.update({ where: { id }, data: { isActive }, include: { destination: true, items: true } }); await this.audit.record(isActive ? "PACKAGE_ACTIVATED" : "PACKAGE_ARCHIVED", "Package", id, actorId); return pkg; }

  private packageData(input: CreatePackageDto) { return { name: input.name, slug: input.slug, summary: input.summary, packageType: input.packageType ?? "Private", tier: input.tier ?? "Standard", route: input.route, durationDays: input.durationDays, basePrice: input.basePrice, currency: input.currency ?? "PKR", imageUrl: input.imageUrl, gallery: input.gallery as Prisma.InputJsonValue | undefined, itinerary: input.itinerary as Prisma.InputJsonValue | undefined, cancellationSummary: input.cancellationSummary, seoTitle: input.seoTitle, seoDescription: input.seoDescription }; }
  private destinationData(input: CreateDestinationDto) { const bestFor = Array.isArray(input.bestFor) ? input.bestFor : input.bestFor ? input.bestFor.split(",").map((value) => value.trim()).filter(Boolean) : undefined; return { name: input.name, slug: input.slug, description: input.description, shortDescription: input.shortDescription, fullDescription: input.fullDescription, bestFor, travelTime: input.travelTime, popularServices: input.popularServices as Prisma.InputJsonValue | undefined, imageUrl: input.imageUrl, gallery: input.gallery as Prisma.InputJsonValue | undefined, seoTitle: input.seoTitle, seoDescription: input.seoDescription }; }
}
