import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { success } from "../common/api-response";
import { AuthenticatedUser } from "../auth/auth.types";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../common/enums";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { SupportService } from "./support.service";

type RequestWithUser = { user: AuthenticatedUser };
const adminSupportRoles = [UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT];

@Controller("support")
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly support: SupportService) {}

  @Post("tickets")
  async create(@Req() request: RequestWithUser, @Body() input: CreateTicketDto) { return success(await this.support.create(request.user.id, input), "Support ticket created"); }
  @Get("tickets")
  async list(@Req() request: RequestWithUser) { return success(await this.support.list(request.user.id), "Support tickets fetched successfully"); }
  @Post("tickets/:id/messages")
  async addMessage(@Req() request: RequestWithUser, @Param("id") id: string, @Body() input: CreateMessageDto) { return success(await this.support.addMessage(request.user.id, id, input), "Support message added"); }

  @Get("admin/tickets")
  @Roles(...adminSupportRoles)
  @UseGuards(RolesGuard)
  async adminList() { return success(await this.support.adminList(), "Admin support tickets fetched successfully"); }

  @Patch("admin/tickets/:id")
  @Roles(...adminSupportRoles)
  @UseGuards(RolesGuard)
  async adminUpdate(@Req() request: RequestWithUser, @Param("id") id: string, @Body() input: { status?: string; assignedTo?: string | null }) { return success(await this.support.adminUpdate(request.user.id, id, input), "Support ticket updated"); }

  @Post("admin/tickets/:id/messages")
  @Roles(...adminSupportRoles)
  @UseGuards(RolesGuard)
  async adminMessage(@Req() request: RequestWithUser, @Param("id") id: string, @Body() input: CreateMessageDto) { return success(await this.support.adminMessage(request.user.id, id, input), "Support message sent"); }
}
