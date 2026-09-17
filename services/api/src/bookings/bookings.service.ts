import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../common/audit.service";
import { BookingStatus, Language, UserRole } from "../common/enums";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}

  async create(input: CreateBookingDto, authenticatedUserId?: string) {
    if (!input.consent) throw new BadRequestException("Terms and Privacy consent is required");
    const start = new Date(input.travelStart); const end = new Date(input.travelEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) throw new BadRequestException("Travel end date must be after the start date");
    const pkg = input.packageSlug ? await this.prisma.package.findFirst({ where: { slug: input.packageSlug, isActive: true }, include: { destination: true } }) : null;
    if (input.packageSlug && !pkg) throw new NotFoundException("Package not found");
    const destination = pkg?.destination.name ?? input.destination;
    const user = authenticatedUserId ? await this.prisma.user.findUnique({ where: { id: authenticatedUserId } }) : await this.prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (authenticatedUserId && !user) throw new NotFoundException("User not found");
    if (user && user.role !== UserRole.TOURIST) throw new BadRequestException("This email is already assigned to a non-tourist account");
    const reference = `SS-${randomBytes(4).toString("hex").toUpperCase()}`;
    const booking = await this.prisma.$transaction(async (tx) => {
      const tourist = user ?? await tx.user.create({ data: { fullName: input.fullName, email: input.email.toLowerCase(), phone: input.phone, role: UserRole.TOURIST, preferredLanguage: input.preferredLanguage ?? Language.EN, touristProfile: { create: {} } } });
      if (user) await tx.user.update({ where: { id: user.id }, data: { fullName: input.fullName, phone: input.phone, preferredLanguage: input.preferredLanguage ?? user.preferredLanguage } });
      return tx.booking.create({ data: { reference, touristId: tourist.id, packageId: pkg?.id, destination, travelStart: start, travelEnd: end, travelersCount: input.travelersCount, pickupCity: input.pickupCity, specialRequests: input.specialRequests, status: BookingStatus.CALL_PENDING, events: { create: { eventType: "BOOKING_REQUEST_SUBMITTED", actorId: authenticatedUserId ?? tourist.id, payload: { source: "website", packageSlug: input.packageSlug ?? null } } } }, include: { package: { select: { name: true, slug: true } }, tourist: { select: { fullName: true, email: true } } } });
    });
    await this.audit.record("BOOKING_REQUEST_SUBMITTED", "Booking", booking.id, authenticatedUserId, { reference: booking.reference, packageSlug: input.packageSlug ?? null });
    return { id: booking.id, reference: booking.reference, status: booking.status, destination: booking.destination, package: booking.package, tourist: booking.tourist };
  }
}
