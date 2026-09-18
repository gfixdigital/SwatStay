import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { destination?: string; type?: string; tier?: string }) {
    const where: Record<string, unknown> = { isActive: true };

    if (filters?.destination) {
      where.destination = { slug: filters.destination };
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.tier) {
      where.tier = filters.tier;
    }

    return this.prisma.package.findMany({
      where,
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        items: true,
        serviceAssignments: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findBySlug(slug: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { slug },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        items: true,
        serviceAssignments: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!pkg) {
      throw new NotFoundException(`Package with slug "${slug}" not found`);
    }

    return pkg;
  }
}
