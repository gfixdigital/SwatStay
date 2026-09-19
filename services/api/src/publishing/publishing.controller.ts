import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { UserRole } from "../common/enums";
import { success } from "../common/api-response";
import { PublishingService } from "./publishing.service";

type RequestWithUser = { user: AuthenticatedUser };
const publishingRoles = [UserRole.ADMIN, UserRole.OPERATIONS];

@Controller()
export class PublishingController {
  constructor(private readonly publishing: PublishingService) {}
  @Post("reviews") async createReview(@Body() input: { bookingId?: string; userId?: string; travelerName: string; rating: number; comment: string }) { return success(await this.publishing.createReview(input), "Review submitted"); }
  @Get("admin/reviews") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(...publishingRoles) async reviews() { return success(await this.publishing.listReviews(), "Reviews fetched successfully"); }
  @Patch("admin/reviews/:id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(...publishingRoles) async updateReview(@Req() req: RequestWithUser, @Param("id") id: string, @Body("status") status: string) { return success(await this.publishing.updateReview(req.user.id, id, status), "Review status updated"); }
  @Get("admin/content") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(...publishingRoles) async content(@Query("kind") kind?: string) { return success(await this.publishing.listContent(kind), "Content entries fetched successfully"); }
  @Put("admin/content/:entryKey") @UseGuards(JwtAuthGuard, RolesGuard) @Roles(...publishingRoles) async saveContent(@Req() req: RequestWithUser, @Param("entryKey") entryKey: string, @Body() input: { kind: string; payload: unknown; status?: string }) { return success(await this.publishing.saveContent(req.user.id, entryKey, input), "Content entry saved"); }
}
