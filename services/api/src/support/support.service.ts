import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { EmailService } from "../common/email.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService, private readonly email: EmailService) {}

  async create(userId: string | undefined, input: CreateTicketDto) {
    const ticket = await this.prisma.supportTicket.create({ data: { userId, guestEmail: input.guestEmail, subject: input.subject, issueType: input.issueType, messages: input.message ? { create: { authorId: userId, body: input.message, audience: "TRAVELER" } } : undefined }, include: { messages: true } });
    await this.audit.record("SUPPORT_TICKET_CREATED", "SupportTicket", ticket.id, userId);
    const notify = this.email.operationsAddress();
    if (notify) void this.email.send({ to: notify, subject: `New support request: ${input.subject}`, html: `<h2>New support request</h2><p><strong>${input.subject}</strong></p><p>${input.message ?? "No initial message"}</p>` });
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

  async adminList() {
    return this.prisma.supportTicket.findMany({ include: { user: true, messages: { include: { author: true }, orderBy: { createdAt: "asc" } } }, orderBy: { updatedAt: "desc" } });
  }

  async adminUpdate(actorId: string, ticketId: string, input: { status?: string; assignedTo?: string | null }) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException("Support ticket not found");
    const updated = await this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status: input.status, assignedTo: input.assignedTo } });
    await this.audit.record("SUPPORT_TICKET_UPDATED", "SupportTicket", ticketId, actorId, input as Prisma.InputJsonValue);
    return updated;
  }

  async adminMessage(actorId: string, ticketId: string, input: CreateMessageDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException("Support ticket not found");
    const message = await this.prisma.supportMessage.create({ data: { ticketId, authorId: actorId, body: input.body, audience: input.audience ?? "TRAVELER" }, include: { author: true } });
    await this.prisma.supportTicket.update({ where: { id: ticketId }, data: { status: "IN_PROGRESS" } });
    await this.audit.record("SUPPORT_MESSAGE_SENT", "SupportTicket", ticketId, actorId, { audience: message.audience });
    if (message.audience === "TRAVELER") { const traveler = await this.prisma.user.findUnique({ where: { id: ticket.userId ?? "" }, select: { email: true, fullName: true } }).catch(() => null); if (traveler?.email) void this.email.send({ to: traveler.email, subject: `New update on support request ${ticketId}`, html: `<p>Hello ${traveler.fullName},</p><p>${input.body}</p>` }); }
    return message;
  }
}
