import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(userId: string | undefined, input: CreateTicketDto) {
    const ticket = await this.prisma.supportTicket.create({ data: { userId, guestEmail: input.guestEmail, subject: input.subject, issueType: input.issueType, messages: input.message ? { create: { authorId: userId, body: input.message, audience: "TRAVELER" } } : undefined }, include: { messages: true } });
    await this.audit.record("SUPPORT_TICKET_CREATED", "SupportTicket", ticket.id, userId);
    return ticket;
  }

  list(userId: string) { return this.prisma.supportTicket.findMany({ where: { userId }, include: { messages: true }, orderBy: { updatedAt: "desc" } }); }

  async addMessage(userId: string, ticketId: string, input: CreateMessageDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException("Support ticket not found");
    if (ticket.userId !== userId) throw new ForbiddenException("You cannot access this support ticket");
    const message = await this.prisma.supportMessage.create({ data: { ticketId, authorId: userId, body: input.body, audience: "TRAVELER" } });
    await this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status: "OPEN" } });
    return message;
  }
}
