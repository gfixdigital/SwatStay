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
}
