import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  check() {
    return { success: true, data: { status: "ok", service: "swatstay-api" } };
  }

  @Get("ready")
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { success: true, data: { status: "ready", database: "connected" } };
    } catch {
      return { success: false, data: { status: "not-ready", database: "unavailable" } };
    }
  }
}
