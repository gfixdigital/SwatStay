import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  recordBookingEvent(bookingId: string, eventType: string, actorId?: string, payload?: Prisma.InputJsonValue) {
    return this.prisma.bookingEvent.create({ data: { bookingId, eventType, actorId, payload } });
  }
}
