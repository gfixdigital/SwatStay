import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { success } from "../common/api-response";
import { AuthenticatedUser } from "../auth/auth.types";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { SupportService } from "./support.service";

type RequestWithUser = { user: AuthenticatedUser };

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
}
