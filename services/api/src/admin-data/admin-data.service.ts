import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuditService } from "../common/audit.service";
import { PrismaService } from "../database/prisma.service";
import { UpsertAdminRecordDto } from "./dto/upsert-admin-record.dto";

@Injectable()
export class AdminDataService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async get(recordKey: string) {
    const record = await this.prisma.adminRecord.findUnique({ where: { recordKey } });
    return record?.payload ?? null;
  }

  async upsert(actorId: string, recordKey: string, input: UpsertAdminRecordDto) {
    const record = await this.prisma.adminRecord.upsert({
      where: { recordKey },
      update: { payload: input.payload as Prisma.InputJsonValue, updatedById: actorId },
      create: { recordKey, payload: input.payload as Prisma.InputJsonValue, updatedById: actorId },
    });
    await this.audit.record("ADMIN_RECORD_UPDATED", "AdminRecord", record.id, actorId, { recordKey });
    return record.payload;
  }
}
