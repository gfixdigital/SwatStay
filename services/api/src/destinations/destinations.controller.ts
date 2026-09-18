import { Controller, Get, Param } from "@nestjs/common";
import { DestinationsService } from "./destinations.service";

@Controller("destinations")
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async findAll() {
    const destinations = await this.destinationsService.findAll();
    return { success: true, message: "Destinations fetched successfully", data: destinations };
  }

  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    const destination = await this.destinationsService.findBySlug(slug);
    if (!destination) {
      return { success: false, message: "Destination not found" };
    }
    return { success: true, message: "Destination fetched successfully", data: destination };
  }
}
