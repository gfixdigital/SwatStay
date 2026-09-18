import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentStatus, PayoutStatus } from "../common/enums";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { PaymentProofDto } from "./dto/payment-proof.dto";
import { PaymentReviewDto } from "./dto/payment-review.dto";
import { CommissionDto } from "./dto/commission.dto";
import { PayoutStatusDto } from "./dto/payout-status.dto";

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async submitPaymentProof(userId: string, bookingId: string, input: PaymentProofDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.touristId !== userId) throw new ForbiddenException("You cannot update this booking");
    const payment = await this.prisma.payment.create({ data: { bookingId, submittedById: userId, amount: input.amount, method: input.method, transactionReference: input.transactionReference, proofUrl: input.proofUrl, reviewNote: input.notes, status: PaymentStatus.PROOF_SUBMITTED } });
    await this.prisma.booking.update({ where: { id: bookingId }, data: { paymentStatus: PaymentStatus.PROOF_SUBMITTED } });
    await this.audit.record("PAYMENT_PROOF_SUBMITTED", "Payment", payment.id, userId, { bookingId });
    return payment;
  }

  listPayments() { return this.prisma.payment.findMany({ include: { booking: { select: { reference: true, destination: true } }, submittedBy: { select: { id: true, fullName: true, email: true } }, reviewedBy: { select: { fullName: true } } }, orderBy: { submittedAt: "desc" } }); }

  async reviewPayment(actorId: string, id: string, input: PaymentReviewDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException("Payment not found");
    const updated = await this.prisma.payment.update({ where: { id }, data: { status: input.status, reviewNote: input.reviewNote, reviewedById: actorId, reviewedAt: new Date() } });
    await this.prisma.booking.update({ where: { id: payment.bookingId }, data: { paymentStatus: input.status } });
    await this.audit.record("PAYMENT_REVIEWED", "Payment", id, actorId, { status: input.status, bookingId: payment.bookingId });
    return updated;
  }

  async createCommission(actorId: string, input: CommissionDto) {
    const [booking, provider] = await Promise.all([this.prisma.booking.findUnique({ where: { id: input.bookingId } }), this.prisma.provider.findUnique({ where: { id: input.providerId } })]);
    if (!booking) throw new NotFoundException("Booking not found");
    if (!provider) throw new NotFoundException("Provider not found");
    if (input.bookingItemId) {
      const item = await this.prisma.bookingItem.findUnique({ where: { id: input.bookingItemId } });
      if (!item || item.bookingId !== input.bookingId || item.providerId !== input.providerId) throw new BadRequestException("Booking item does not belong to this booking and provider");
    }
    const existing = await this.prisma.commission.findFirst({ where: { bookingId: input.bookingId, bookingItemId: input.bookingItemId ?? null, providerId: input.providerId } });
    if (existing) throw new BadRequestException("A commission already exists for this booking service");
    const commissionAmount = Math.round(input.grossAmount * (input.rate / 100));
    const commission = await this.prisma.$transaction(async (tx) => tx.commission.create({ data: { bookingId: input.bookingId, bookingItemId: input.bookingItemId, providerId: input.providerId, rate: input.rate, grossAmount: input.grossAmount, commissionAmount, providerAmount: input.grossAmount - commissionAmount, payout: { create: { providerId: input.providerId, amount: input.grossAmount - commissionAmount } } }, include: { payout: true, provider: true } }));
    await this.audit.record("COMMISSION_CREATED", "Commission", commission.id, actorId, { bookingId: input.bookingId, providerId: input.providerId, commissionAmount, providerAmount: input.grossAmount - commissionAmount });
    return commission;
  }

  getBookingFinance(bookingId: string) { return this.prisma.booking.findUnique({ where: { id: bookingId }, include: { payments: { orderBy: { submittedAt: "desc" } }, commissions: { include: { provider: true, payout: true } } } }); }
  listPayouts() { return this.prisma.payout.findMany({ include: { provider: true, commission: true }, orderBy: { createdAt: "desc" } }); }

  async updatePayout(actorId: string, id: string, input: PayoutStatusDto) {
    const payout = await this.prisma.payout.findUnique({ where: { id } });
    if (!payout) throw new NotFoundException("Payout not found");
    const allowed: Record<PayoutStatus, PayoutStatus[]> = { PENDING: [PayoutStatus.APPROVED], APPROVED: [PayoutStatus.PROCESSING], PROCESSING: [PayoutStatus.PAID, PayoutStatus.FAILED], PAID: [], FAILED: [PayoutStatus.PROCESSING] };
    if (!allowed[payout.status as PayoutStatus].includes(input.status)) throw new BadRequestException(`Invalid payout transition from ${payout.status} to ${input.status}`);
    const updated = await this.prisma.payout.update({ where: { id }, data: { status: input.status, financeNote: input.financeNote, approvedById: input.status === PayoutStatus.APPROVED ? actorId : undefined, paidAt: input.status === PayoutStatus.PAID ? new Date() : undefined } });
    await this.audit.record("PAYOUT_STATUS_UPDATED", "Payout", id, actorId, { from: payout.status, to: input.status });
    return updated;
  }

  getProviderFinance(userId: string) { return this.prisma.provider.findUnique({ where: { userId }, include: { commissions: { include: { booking: { select: { reference: true, destination: true, travelStart: true } }, payout: true }, orderBy: { createdAt: "desc" } }, payouts: { orderBy: { createdAt: "desc" } } } }); }
}
