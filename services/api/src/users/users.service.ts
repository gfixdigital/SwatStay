import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { touristProfile: true } });
    if (!user) throw new NotFoundException("User not found");
    return { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, country: user.touristProfile?.country ?? null, whatsapp: user.touristProfile?.whatsapp ?? null, travelPreferences: user.travelPreferences, role: user.role, preferredLanguage: user.preferredLanguage };
  }

  async updateProfile(userId: string, input: UpdateProfileDto) {
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { fullName: input.fullName, phone: input.phone, address: input.address, travelPreferences: input.travelPreferences as Prisma.InputJsonValue } });
    if (input.country !== undefined) await this.prisma.touristProfile.upsert({ where: { userId }, update: { country: input.country }, create: { userId, country: input.country } });
    return this.getProfile(updated.id);
  }

  getBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { touristId: userId },
      include: {
        package: { select: { name: true, basePrice: true, currency: true, itinerary: true } },
        items: { include: { provider: { select: { businessName: true, location: true } } }, orderBy: { serviceType: "asc" } },
        payments: { orderBy: { submittedAt: "desc" } },
        events: { orderBy: { createdAt: "asc" } },
        vouchers: { select: { id: true, code: true, status: true, expiresAt: true, payload: true, updatedAt: true }, orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
