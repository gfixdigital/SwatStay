import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuditService } from "../common/audit.service";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class PublishingService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  listReviews() { return this.prisma.review.findMany({ orderBy: { createdAt: "desc" } }); }
  async createReview(input: { bookingId?: string; userId?: string; travelerName: string; rating: number; comment: string }) { return this.prisma.review.create({ data: { ...input, status: "PENDING" } }); }
  async updateReview(actorId: string, id: string, status: string) { const review = await this.prisma.review.findUnique({ where: { id } }); if (!review) throw new NotFoundException("Review not found"); const updated = await this.prisma.review.update({ where: { id }, data: { status, publishedAt: status === "PUBLISHED" ? new Date() : null } }); await this.audit.record("REVIEW_STATUS_UPDATED", "Review", id, actorId, { status }); return updated; }
  listContent(kind?: string) { return this.prisma.contentEntry.findMany({ where: kind ? { kind } : undefined, orderBy: { updatedAt: "desc" } }); }
  async saveContent(actorId: string, entryKey: string, input: { kind: string; payload: unknown; status?: string }) { const existing = await this.prisma.contentEntry.findUnique({ where: { entryKey } }); const updated = await this.prisma.contentEntry.upsert({ where: { entryKey }, update: { kind: input.kind, payload: input.payload as Prisma.InputJsonValue, status: input.status ?? "DRAFT", version: { increment: existing ? 1 : 0 }, updatedById: actorId, publishedAt: input.status === "PUBLISHED" ? new Date() : undefined }, create: { entryKey, kind: input.kind, payload: input.payload as Prisma.InputJsonValue, status: input.status ?? "DRAFT", updatedById: actorId } }); await this.audit.record("CONTENT_ENTRY_SAVED", "ContentEntry", updated.id, actorId, { entryKey, kind: input.kind, status: updated.status }); return updated; }
}
