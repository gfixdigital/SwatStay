import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { UserRole } from "../common/enums";
import { success } from "../common/api-response";
import { CatalogService } from "./catalog.service";
import { CreateDestinationDto } from "./dto/create-destination.dto";
import { CreatePackageDto } from "./dto/create-package.dto";

type RequestWithUser = { user: AuthenticatedUser };
const catalogRoles = [UserRole.ADMIN, UserRole.OPERATIONS];

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...catalogRoles)
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}
  @Get("destinations") async destinations() { return success(await this.catalog.listDestinations(), "Admin destinations fetched successfully"); }
  @Post("destinations") async createDestination(@Req() req: RequestWithUser, @Body() input: CreateDestinationDto) { return success(await this.catalog.createDestination(req.user.id, input), "Destination created"); }
  @Patch("destinations/:id") async updateDestination(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: CreateDestinationDto) { return success(await this.catalog.updateDestination(req.user.id, id, input), "Destination updated"); }
  @Patch("destinations/:id/active") async setDestinationActive(@Req() req: RequestWithUser, @Param("id") id: string, @Body("isActive") isActive: boolean) { return success(await this.catalog.setDestinationActive(req.user.id, id, isActive), "Destination status updated"); }
  @Get("packages") async packages() { return success(await this.catalog.listPackages(), "Admin packages fetched successfully"); }
  @Post("packages") async createPackage(@Req() req: RequestWithUser, @Body() input: CreatePackageDto) { return success(await this.catalog.createPackage(req.user.id, input), "Package created"); }
  @Patch("packages/:id") async updatePackage(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: CreatePackageDto) { return success(await this.catalog.updatePackage(req.user.id, id, input), "Package updated"); }
  @Patch("packages/:id/active") async setActive(@Req() req: RequestWithUser, @Param("id") id: string, @Body("isActive") isActive: boolean) { return success(await this.catalog.setActive(req.user.id, id, isActive), "Package status updated"); }
  @Get("providers/:id/media") async providerMedia(@Param("id") id: string) { return success(await this.catalog.getProviderMedia(id), "Provider media fetched successfully"); }
  @Patch("providers/:id/media") async updateProviderMedia(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: { coverImage?: string | null; gallery?: string[]; documents?: string[] }) { return success(await this.catalog.updateProviderMedia(req.user.id, id, input), "Provider media updated"); }
}
