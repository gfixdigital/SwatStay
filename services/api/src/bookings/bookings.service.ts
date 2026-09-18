import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { AssignmentStatus, BookingStatus, Language, PaymentStatus, ServiceType, UserRole } from "../common/enums";
import { AssignBookingDto } from "./dto/assign-booking.dto";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { ProviderAssignmentDto } from "./dto/provider-assignment.dto";
import { ProviderDecisionDto } from "./dto/provider-decision.dto";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(input: CreateBookingDto, authenticatedUserId?: string) {
    if (!input.consent) throw new BadRequestException("Terms and Privacy consent is required");
    const start = new Date(input.travelStart);
    const end = new Date(input.travelEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      throw new BadRequestException("Travel end date must be after the start date");
    }
    const pkg = input.packageSlug
      ? await this.prisma.package.findFirst({ where: { slug: input.packageSlug, isActive: true }, include: { destination: true } })
      : null;
    if (input.packageSlug && !pkg) throw new NotFoundException("Package not found");
    const destination = pkg?.destination?.name ?? input.destination;
    const user = authenticatedUserId
      ? await this.prisma.user.findUnique({ where: { id: authenticatedUserId } })
      : await this.prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (authenticatedUserId && !user) throw new NotFoundException("User not found");
    if (user && user.role !== UserRole.TOURIST) {
      throw new BadRequestException("This email is already assigned to a non-tourist account");
    }
    const reference = `SS-${randomBytes(4).toString("hex").toUpperCase()}`;
    const booking = await this.prisma.$transaction(async (tx) => {
      const tourist = user ?? await tx.user.create({
        data: {
          fullName: input.fullName,
          email: input.email.toLowerCase(),
          phone: input.phone,
          role: UserRole.TOURIST,
          preferredLanguage: input.preferredLanguage ?? Language.EN,
          touristProfile: { create: { whatsapp: input.whatsapp ?? null, country: input.country ?? null } },
        },
      });
      if (user) {
        await tx.user.update({
          where: { id: user.id },
          data: { fullName: input.fullName, phone: input.phone, preferredLanguage: input.preferredLanguage ?? user.preferredLanguage },
        });
      }
      return tx.booking.create({
        data: {
          reference,
          touristId: tourist.id,
          packageId: pkg?.id ?? null,
          destination,
          travelStart: start,
          travelEnd: end,
          travelersCount: input.travelersCount,
          travelerType: input.travelerType ?? null,
          tier: input.tier ?? null,
          pickupCity: input.pickupCity ?? null,
          specialRequests: input.specialRequests ?? null,
          whatsapp: input.whatsapp ?? null,
          country: input.country ?? null,
          preferredPaymentMethod: input.preferredPaymentMethod ?? null,
          status: BookingStatus.CALL_PENDING,
          events: {
            create: {
              eventType: "BOOKING_REQUEST_SUBMITTED",
              actorId: authenticatedUserId ?? tourist.id,
              payload: {
                source: "website",
                packageSlug: input.packageSlug ?? null,
                fullName: input.fullName,
                phone: input.phone,
                email: input.email,
                travelersCount: input.travelersCount,
                travelerType: input.travelerType ?? null,
                tier: input.tier ?? null,
                pickupCity: input.pickupCity ?? null,
              },
            },
          },
        },
        include: { package: { select: { name: true, slug: true } }, tourist: { select: { fullName: true, email: true } } },
      });
    });
    await this.audit.record("BOOKING_REQUEST_SUBMITTED", "Booking", booking.id, authenticatedUserId, {
      reference: booking.reference,
      packageSlug: input.packageSlug ?? null,
    });
    return { bookingId: booking.id, reference: booking.reference, status: booking.status };
  }

  async adminList() {
    const bookings = await this.prisma.booking.findMany({ include: this.adminInclude(), orderBy: { createdAt: "desc" } });
    return bookings.map((booking) => this.toAdminBooking(booking));
  }

  async adminDetail(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: this.adminInclude() });
    if (!booking) throw new NotFoundException("Booking not found");
    return this.toAdminBooking(booking);
  }

  teamMembers() { return this.prisma.user.findMany({ where: { isActive: true, role: { in: [UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT] } }, select: { id: true, fullName: true, email: true, role: true }, orderBy: { fullName: "asc" } }); }

  async setStatus(actorId: string, id: string, status: BookingStatus) {
    const current = await this.prisma.booking.findUnique({ where: { id }, select: { status: true, reference: true } });
    if (!current) throw new NotFoundException("Booking not found");
    if (current.status !== status && !this.allowedStatusChange(current.status as BookingStatus, status)) throw new BadRequestException(`Booking cannot move from ${current.status} to ${status}`);
    const booking = await this.prisma.booking.update({ where: { id }, data: { status }, include: this.adminInclude() });
    await this.audit.recordBookingEvent(id, "BOOKING_STATUS_UPDATED", actorId, { from: current.status, to: status });
    await this.audit.record("BOOKING_STATUS_UPDATED", "Booking", id, actorId, { reference: current.reference, from: current.status, to: status });
    return this.toAdminBooking(booking);
  }

  async setPaymentStatus(actorId: string, id: string, paymentStatus: PaymentStatus) {
    const current = await this.prisma.booking.findUnique({ where: { id }, select: { paymentStatus: true, reference: true } });
    if (!current) throw new NotFoundException("Booking not found");
    const booking = await this.prisma.booking.update({ where: { id }, data: { paymentStatus }, include: this.adminInclude() });
    await this.audit.recordBookingEvent(id, "BOOKING_PAYMENT_STATUS_UPDATED", actorId, { from: current.paymentStatus, to: paymentStatus });
    await this.audit.record("BOOKING_PAYMENT_STATUS_UPDATED", "Booking", id, actorId, { reference: current.reference, from: current.paymentStatus, to: paymentStatus });
    return this.toAdminBooking(booking);
  }

  async assign(actorId: string, id: string, input: AssignBookingDto) {
    const [booking, member] = await Promise.all([
      this.prisma.booking.findUnique({ where: { id }, select: { reference: true } }),
      this.prisma.user.findFirst({ where: { id: input.memberId, isActive: true, role: { in: [UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT] } }, select: { id: true, fullName: true, role: true } }),
    ]);
    if (!booking) throw new NotFoundException("Booking not found");
    if (!member) throw new BadRequestException("Only active admin, operations, or support members can be assigned");
    await this.prisma.bookingTeamAssignment.create({ data: { bookingId: id, memberId: member.id, assignedById: actorId } });
    await this.audit.recordBookingEvent(id, "BOOKING_TEAM_ASSIGNED", actorId, { memberId: member.id, memberName: member.fullName, reason: input.reason ?? null });
    await this.audit.record("BOOKING_TEAM_ASSIGNED", "Booking", id, actorId, { reference: booking.reference, memberId: member.id, reason: input.reason ?? null });
    return this.adminDetail(id);
  }

  async addNote(actorId: string, id: string, note: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, select: { reference: true } });
    if (!booking) throw new NotFoundException("Booking not found");
    await this.audit.recordBookingEvent(id, "BOOKING_NOTE_ADDED", actorId, { note });
    await this.audit.record("BOOKING_NOTE_ADDED", "Booking", id, actorId, { reference: booking.reference });
    return this.adminDetail(id);
  }

  async providerSuggestions(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { items: { include: { provider: true } }, package: { include: { items: true } } },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    const serviceTypes = [...new Set((booking.items.length ? booking.items.map((item) => item.serviceType) : booking.package?.items.map((item) => item.serviceType) ?? [ServiceType.HOTEL, ServiceType.TRANSPORT]))];
    const providers = await this.prisma.provider.findMany({ where: { status: "APPROVED", serviceCategory: { in: serviceTypes } }, orderBy: [{ serviceCategory: "asc" }, { businessName: "asc" }] });
    return serviceTypes.map((serviceType) => ({
      serviceType,
      selectedProviderId: booking.items.find((item) => item.serviceType === serviceType)?.providerId ?? null,
      providers: providers.filter((provider) => provider.serviceCategory === serviceType).map((provider) => ({ id: provider.id, name: provider.businessName, serviceType: provider.serviceCategory, location: provider.location, phone: provider.phone, commissionRate: provider.defaultCommissionRate ? Number(provider.defaultCommissionRate) : null, status: provider.status })),
    }));
  }

  async assignProvider(actorId: string, id: string, input: ProviderAssignmentDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: { items: true } });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.paymentStatus !== PaymentStatus.VERIFIED) throw new BadRequestException("Payment must be verified before assigning providers");
    if (![BookingStatus.PROVIDER_SELECTION, BookingStatus.PROVIDER_PENDING].includes(booking.status as BookingStatus)) throw new BadRequestException("Booking is not in the provider assignment step");
    const provider = await this.prisma.provider.findFirst({ where: { id: input.providerId, status: "APPROVED", serviceCategory: input.serviceType } });
    if (!provider) throw new BadRequestException("Only an approved provider matching this service type can be assigned");
    const existing = booking.items.find((item) => item.serviceType === input.serviceType);
    const item = existing
      ? await this.prisma.bookingItem.update({ where: { id: existing.id }, data: { providerId: provider.id, status: AssignmentStatus.PENDING_PROVIDER, price: input.price, commission: input.commission } })
      : await this.prisma.bookingItem.create({ data: { bookingId: id, providerId: provider.id, serviceType: input.serviceType, status: AssignmentStatus.PENDING_PROVIDER, price: input.price, commission: input.commission } });
    await this.audit.recordBookingEvent(id, "BOOKING_PROVIDER_ASSIGNED", actorId, { bookingItemId: item.id, providerId: provider.id, providerName: provider.businessName, serviceType: input.serviceType, note: input.note ?? null });
    await this.audit.record("BOOKING_PROVIDER_ASSIGNED", "Booking", id, actorId, { providerId: provider.id, serviceType: input.serviceType });
    return this.adminDetail(id);
  }

  async confirmProviderAssignments(actorId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: { items: true, package: { include: { items: true } } } });
    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.paymentStatus !== PaymentStatus.VERIFIED) throw new BadRequestException("Payment must be verified before confirming providers");
    const required = booking.items.length ? booking.items.map((item) => item.serviceType) : booking.package?.items.map((item) => item.serviceType) ?? [ServiceType.HOTEL, ServiceType.TRANSPORT];
    const assignedTypes = new Set(booking.items.filter((item) => item.providerId && item.status === AssignmentStatus.PENDING_PROVIDER).map((item) => item.serviceType));
    const missing = required.filter((serviceType) => !assignedTypes.has(serviceType));
    if (missing.length) throw new BadRequestException(`Assign providers for: ${missing.join(", ")}`);
    await this.prisma.booking.update({ where: { id }, data: { status: BookingStatus.PROVIDER_PENDING } });
    await this.audit.recordBookingEvent(id, "BOOKING_PROVIDER_ASSIGNMENT_CONFIRMED", actorId, { serviceTypes: required });
    await this.audit.record("BOOKING_PROVIDER_ASSIGNMENT_CONFIRMED", "Booking", id, actorId, { serviceTypes: required });
    return this.adminDetail(id);
  }

  async providerAssignments(userId: string) {
    const provider = await this.prisma.provider.findUnique({ where: { userId }, select: { id: true, businessName: true, status: true } });
    if (!provider) throw new NotFoundException("Provider profile not found");
    return this.prisma.bookingItem.findMany({ where: { providerId: provider.id, status: { in: [AssignmentStatus.PENDING_PROVIDER, AssignmentStatus.ACCEPTED, AssignmentStatus.REJECTED] } }, include: { provider: { select: { businessName: true, serviceCategory: true, location: true } }, booking: { include: { tourist: { select: { fullName: true, phone: true, preferredLanguage: true } }, package: { select: { name: true, slug: true } } } } }, orderBy: { booking: { travelStart: "asc" } } });
  }

  async providerDecision(userId: string, itemId: string, input: ProviderDecisionDto) {
    if (![AssignmentStatus.ACCEPTED, AssignmentStatus.REJECTED].includes(input.status)) throw new BadRequestException("Provider decision must be accepted or rejected");
    const provider = await this.prisma.provider.findUnique({ where: { userId }, select: { id: true } });
    if (!provider) throw new NotFoundException("Provider profile not found");
    const item = await this.prisma.bookingItem.findFirst({ where: { id: itemId, providerId: provider.id }, include: { booking: { select: { id: true, reference: true, status: true } } } });
    if (!item) throw new NotFoundException("Provider assignment not found");
    if (item.status !== AssignmentStatus.PENDING_PROVIDER) throw new BadRequestException("This assignment has already been decided");
    const updated = await this.prisma.bookingItem.update({ where: { id: itemId }, data: { status: input.status } });
    const eventType = input.status === AssignmentStatus.ACCEPTED ? "PROVIDER_ASSIGNMENT_ACCEPTED" : "PROVIDER_ASSIGNMENT_REJECTED";
    await this.audit.recordBookingEvent(item.booking.id, eventType, userId, { bookingItemId: itemId, providerId: provider.id, note: input.note ?? null });
    await this.audit.record(eventType, "BookingItem", itemId, userId, { bookingReference: item.booking.reference, providerId: provider.id });
    const items = await this.prisma.bookingItem.findMany({ where: { bookingId: item.booking.id } });
    if (input.status === AssignmentStatus.REJECTED) await this.prisma.booking.update({ where: { id: item.booking.id }, data: { status: BookingStatus.REQUIRES_ADMIN_ACTION } });
    else if (items.length > 0 && items.every((entry) => entry.providerId && entry.status === AssignmentStatus.ACCEPTED)) await this.prisma.booking.update({ where: { id: item.booking.id }, data: { status: BookingStatus.CONFIRMED } });
    return updated;
  }

  private adminInclude() {
    return {
      package: { select: { name: true, slug: true, basePrice: true, currency: true } },
      items: { include: { provider: { select: { id: true, businessName: true, serviceCategory: true, location: true } } }, orderBy: { serviceType: "asc" as const } },
      tourist: { select: { fullName: true, email: true, phone: true, preferredLanguage: true } },
      payments: { orderBy: { submittedAt: "desc" as const } },
      teamAssignments: { include: { member: { select: { id: true, fullName: true, role: true } }, assignedBy: { select: { fullName: true } } }, orderBy: { assignedAt: "asc" as const } },
      events: { include: { actor: { select: { fullName: true } } }, orderBy: { createdAt: "asc" as const } },
    };
  }

  private toAdminBooking(booking: any) {
    const latestAssignment = booking.teamAssignments?.at(-1);
    const notes = (booking.events ?? []).filter((event: any) => event.eventType === "BOOKING_NOTE_ADDED").map((event: any) => ({ id: event.id, note: event.payload?.note ?? "", actor: event.actor?.fullName ?? "Team member", createdAt: event.createdAt }));
    const amountPaid = (booking.payments ?? []).filter((payment: any) => payment.status !== PaymentStatus.REJECTED && payment.status !== PaymentStatus.REFUNDED).reduce((total: number, payment: any) => total + payment.amount, 0);
    const latestPayment = booking.payments?.[0];
    return { id: booking.id, reference: booking.reference, tourist: booking.tourist, package: booking.package, destination: booking.destination, travelStart: booking.travelStart, travelEnd: booking.travelEnd, travelersCount: booking.travelersCount, pickupCity: booking.pickupCity, specialRequests: booking.specialRequests, status: booking.status, paymentStatus: booking.paymentStatus, totalAmount: booking.package?.basePrice ?? 0, amountPaid, paymentMethod: latestPayment?.method ?? null, assignedMember: latestAssignment?.member ?? null, assignmentHistory: booking.teamAssignments ?? [], providerArrangements: (booking.items ?? []).filter((item: any) => item.provider).map((item: any) => ({ serviceType: item.serviceType, providerId: item.provider.id, providerName: item.provider.businessName, status: item.status === AssignmentStatus.ACCEPTED ? "Confirmed" : item.status === AssignmentStatus.PENDING_PROVIDER ? "Pending provider" : item.status === AssignmentStatus.REJECTED ? "Rejected" : "Needs follow-up", price: item.price, commission: item.commission })), notes, events: booking.events ?? [], createdAt: booking.createdAt, updatedAt: booking.updatedAt };
  }

  private allowedStatusChange(from: BookingStatus, to: BookingStatus) {
    const transitions: Partial<Record<BookingStatus, BookingStatus[]>> = { [BookingStatus.CALL_PENDING]: [BookingStatus.TOURIST_CONFIRMED, BookingStatus.CANCELLED, BookingStatus.REQUIRES_ADMIN_ACTION], [BookingStatus.TOURIST_CONFIRMED]: [BookingStatus.PAYMENT_PENDING, BookingStatus.CANCELLED, BookingStatus.REQUIRES_ADMIN_ACTION], [BookingStatus.PAYMENT_PENDING]: [BookingStatus.ADVANCE_PAID, BookingStatus.PROVIDER_SELECTION, BookingStatus.CANCELLED, BookingStatus.REQUIRES_ADMIN_ACTION], [BookingStatus.ADVANCE_PAID]: [BookingStatus.PROVIDER_SELECTION, BookingStatus.CANCELLED, BookingStatus.REQUIRES_ADMIN_ACTION], [BookingStatus.PROVIDER_SELECTION]: [BookingStatus.PROVIDER_PENDING, BookingStatus.CONFIRMED, BookingStatus.CANCELLED], [BookingStatus.PROVIDER_PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED], [BookingStatus.CONFIRMED]: [BookingStatus.ACTIVE, BookingStatus.CANCELLED], [BookingStatus.ACTIVE]: [BookingStatus.COMPLETED, BookingStatus.REQUIRES_ADMIN_ACTION], [BookingStatus.REQUIRES_ADMIN_ACTION]: [BookingStatus.CALL_PENDING, BookingStatus.TOURIST_CONFIRMED, BookingStatus.PAYMENT_PENDING, BookingStatus.PROVIDER_SELECTION, BookingStatus.CANCELLED] }; return transitions[from]?.includes(to) ?? false;
  }
}
