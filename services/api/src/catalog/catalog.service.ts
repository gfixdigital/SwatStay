import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { CreateDestinationDto } from "./dto/create-destination.dto";
import { CreatePackageDto } from "./dto/create-package.dto";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  listDestinations() { return this.prisma.destination.findMany({ orderBy: { name: "asc" } }); }

  async createDestination(actorId: string, input: CreateDestinationDto) {
    const exists = await this.prisma.destination.findUnique({ where: { slug: input.slug } });
    if (exists) throw new BadRequestException("Destination slug already exists");
    const destination = await this.prisma.destination.create({ data: input });
    await this.audit.record("DESTINATION_CREATED", "Destination", destination.id, actorId, { slug: destination.slug });
    return destination;
  }

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
}
