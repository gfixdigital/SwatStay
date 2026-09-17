import { Controller, Get, Param } from "@nestjs/common";
import { success } from "../common/api-response";
import { PackagesService } from "./packages.service";

@Controller()
export class PackagesController {
  constructor(private readonly packages: PackagesService) {}
  @Get("packages") async list() { return success(await this.packages.list(), "Packages fetched successfully"); }
  @Get("packages/:slug") async get(@Param("slug") slug: string) { return success(await this.packages.getBySlug(slug), "Package fetched successfully"); }
  @Get("destinations") async destinations() { return success(await this.packages.destinations(), "Destinations fetched successfully"); }
}
