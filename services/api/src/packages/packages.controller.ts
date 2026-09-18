import { Controller, Get, Param, Query } from "@nestjs/common";
import { PackagesService } from "./packages.service";

@Controller("packages")
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  async findAll(
    @Query("destination") destination?: string,
    @Query("type") type?: string,
    @Query("tier") tier?: string,
  ) {
    const packages = await this.packagesService.findAll({ destination, type, tier });
    return { success: true, message: "Packages fetched successfully", data: packages };
  }

  @Get(":slug")
  async findBySlug(@Param("slug") slug: string) {
    const pkg = await this.packagesService.findBySlug(slug);
    return { success: true, message: "Package fetched successfully", data: pkg };
  }
}
