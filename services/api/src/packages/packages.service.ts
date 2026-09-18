import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.package.findMany({
      where: { isActive: true },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        items: true,
        serviceAssignments: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getBySlug(slug: string) {
    const item = await this.prisma.package.findFirst({
      where: { slug, isActive: true },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        items: true,
        serviceAssignments: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!item) throw new NotFoundException("Package not found");
    return item;
  }

  destinations() {
    return this.prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }
}
