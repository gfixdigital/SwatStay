import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SupabaseStorageService } from "../storage/supabase-storage.service";

type PackageRecord = Awaited<ReturnType<PrismaService["package"]["findUnique"]>> & {
  destination: { name: string; slug: string } | null;
  items: { serviceType: string; title: string; description: string | null }[];
};

function includedServices(items: { serviceType: string }[]): string[] {
  const map: Record<string, string> = {
    HOTEL: "Hotel",
    TRANSPORT: "Transport",
    GUIDE: "Guide",
    HIKING_GUIDE: "Hiking",
    RESTAURANT: "Meals",
    PHOTOGRAPHY: "Photography",
    ACTIVITY: "Activity",
  };
  return [...new Set(items.map((i) => map[i.serviceType] ?? i.serviceType))];
}

function shapePackage(pkg: PackageRecord) {
  const durationNights = Math.max(0, pkg.durationDays - 1);
  return {
    id: pkg.id,
    title: pkg.name,
    slug: pkg.slug,
    destination: pkg.destination
      ? { name: pkg.destination.name, slug: pkg.destination.slug }
      : null,
    type: pkg.packageType,
    tier: pkg.tier,
    description: pkg.summary,
    durationDays: pkg.durationDays,
    durationNights,
    startingPrice: pkg.basePrice,
    currency: pkg.currency,
    imageUrl: pkg.imageUrl,
    gallery: pkg.gallery,
    itinerary: pkg.itinerary,
    includedServices: includedServices(pkg.items),
    cancellationPolicy: pkg.cancellationSummary,
    items: pkg.items.map((item) => ({
      serviceType: item.serviceType,
      title: item.title,
      description: item.description,
    })),
  };
}

function shapeDestination(dest: {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  imageUrl: string | null;
  bestFor: string[];
  isActive: boolean;
}) {
  return {
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    shortDescription: dest.shortDescription,
    imageUrl: dest.imageUrl,
    bestFor: dest.bestFor,
    isActive: dest.isActive,
  };
}

@Injectable()
export class PackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  async list() {
    const items = await this.prisma.package.findMany({
      where: { isActive: true },
      include: { destination: true, items: true },
      orderBy: { createdAt: "desc" },
    });
    return Promise.all(items.map((item) => this.resolveMedia(shapePackage(item as PackageRecord))));
  }

  async getBySlug(slug: string) {
    const item = await this.prisma.package.findFirst({
      where: { slug, isActive: true },
      include: { destination: true, items: true },
    });
    if (!item) throw new NotFoundException("Package not found");
    return this.resolveMedia(shapePackage(item as PackageRecord));
  }

  async destinations() {
    const items = await this.prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return Promise.all(
      items.map((item) =>
        this.resolveMedia(shapeDestination(item)),
      ),
    );
  }

  private async resolveMedia<T extends { imageUrl: string | null; gallery?: unknown }>(item: T): Promise<T> {
    const imageUrl =
      item.imageUrl?.startsWith("media/")
        ? await this.storage.createSignedUrl(item.imageUrl, 3600)
        : item.imageUrl;
    const gallery = Array.isArray(item.gallery)
      ? await Promise.all(
          item.gallery.map((value) =>
            typeof value === "string" && value.startsWith("media/")
              ? this.storage.createSignedUrl(value, 3600)
              : value,
          ),
        )
      : item.gallery;
    return { ...item, imageUrl, gallery };
  }
}
