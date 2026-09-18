import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { DeletionRequestDto } from "./dto/deletion-request.dto";

@Injectable()
export class PrivacyService {
  constructor(private readonly prisma: PrismaService) {}

  createDeletionRequest(userId: string, input: DeletionRequestDto) {
    return this.prisma.dataDeletionRequest.create({ data: { userId, email: input.email, reason: input.reason } });
  }

  getConsentHistory(userId: string) {
    return this.prisma.consentRecord.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { id: true, consentType: true, policyVersion: true, accepted: true, source: true, createdAt: true } });
  }
}
