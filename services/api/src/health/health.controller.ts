import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return { success: true, data: { status: "ok", service: "swatstay-api" } };
  }

  @Get("ready")
  ready() {
    return { success: true, data: { status: "ready", database: "not-connected" } };
  }
}
