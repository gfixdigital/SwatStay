import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateReference(): string {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `SS-${num}`;
  }

  async create(dto: CreateBookingDto, userId?: string) {
    const startDate = new Date(dto.travelStart);
    const endDate = new Date(dto.travelEnd);

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException("Invalid travel start date");
    }
    if (isNaN(endDate.getTime())) {
      throw new BadRequestException("Invalid travel end date");
    }
    if (endDate <= startDate) {
      throw new BadRequestException("Travel end date must be after start date");
    }
    if (startDate < new Date()) {
      throw new BadRequestException("Travel start date cannot be in the past");
    }

    if (!dto.consentAccepted) {
      throw new BadRequestException("You must agree to the Terms and Conditions and Privacy Policy");
    }

    let packageId: string | undefined;
    if (dto.packageSlug) {
      const pkg = await this.prisma.package.findUnique({
        where: { slug: dto.packageSlug },
      });
      if (pkg) {
        packageId = pkg.id;
      }
    }

    let touristId: string;
    if (userId) {
      touristId = userId;
    } else {
      const anonymousUser = await this.prisma.user.findFirst({
        where: { email: "anonymous@swatstay.pk" },
      });
      if (anonymousUser) {
        touristId = anonymousUser.id;
      } else {
        const created = await this.prisma.user.create({
          data: {
            fullName: dto.fullName,
            email: dto.email || undefined,
            phone: dto.phone || undefined,
            role: "TOURIST",
          },
        });
        touristId = created.id;
      }
    }

    const reference = this.generateReference();

    const booking = await this.prisma.booking.create({
      data: {
        reference,
        touristId,
        packageId,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        country: dto.country,
        destination: dto.destination,
        travelStart: startDate,
        travelEnd: endDate,
        travelersCount: dto.travelersCount,
        travelerType: dto.travelerType,
        tier: dto.tier,
        pickupCity: dto.pickupCity,
        specialRequests: dto.specialRequests,
        preferredPaymentMethod: dto.preferredPaymentMethod,
        preferredLanguage: dto.preferredLanguage || "EN",
        status: "CALL_PENDING",
        paymentStatus: "PENDING",
      },
    });

    await this.prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        eventType: "BOOKING_CREATED",
        payload: {
          source: "tourist_website",
          packageSlug: dto.packageSlug,
          packageTitle: dto.packageTitle,
          fullName: dto.fullName,
          destination: dto.destination,
          travelersCount: dto.travelersCount,
          travelStart: startDate.toISOString(),
          travelEnd: endDate.toISOString(),
        },
      },
    });

    return {
      bookingId: booking.id,
      reference: booking.reference,
      status: booking.status,
    };
  }

  async findAll(filters?: { status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters?.status) {
      where.status = filters.status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          package: { select: { id: true, name: true, slug: true } },
          events: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
        items: true,
        events: { orderBy: { createdAt: "desc" } },
      },
    });
  }
}
