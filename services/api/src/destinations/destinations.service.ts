import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.destination.findUnique({
      where: { slug },
      include: { packages: { where: { isActive: true } } },
    });
  }
}
