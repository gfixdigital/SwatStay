import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "../common/enums";
import { PrismaService } from "../database/prisma.service";
import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async signup(input: SignupDto) {
    if (!input.consentAccepted) throw new UnauthorizedException("Terms and Privacy consent is required");
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email: input.email }, { phone: input.phone }] } });
    if (existing) throw new ConflictException("An account with this email or phone already exists");
    const user = await this.prisma.user.create({
      data: { fullName: input.fullName, email: input.email, phone: input.phone, passwordHash: await hash(input.password, 12), role: UserRole.TOURIST, preferredLanguage: input.preferredLanguage },
    });
    await this.prisma.consentRecord.create({ data: { userId: user.id, consentType: "TERMS_AND_PRIVACY", policyVersion: "v1", accepted: true, source: "signup" } });
    return this.session(user);
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user?.passwordHash || !user.isActive || !(await compare(input.password, user.passwordHash))) throw new UnauthorizedException("Invalid email or password");
    return this.session(user);
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.authSession.findUnique({ where: { tokenHash: this.tokenHash(refreshToken) }, include: { user: true } });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.isActive) throw new UnauthorizedException("Invalid or expired refresh token");
    return this.session(session.user, session.id);
  }

  async logout(refreshToken: string) {
    await this.prisma.authSession.updateMany({ where: { tokenHash: this.tokenHash(refreshToken), revokedAt: null }, data: { revokedAt: new Date() } });
    return { message: "Logged out successfully" };
  }

  async me(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, fullName: true, email: true, phone: true, role: true, preferredLanguage: true, isActive: true } });
  }

  private async session(user: { id: string; fullName: string; email: string | null; role: string }, currentSessionId?: string) {
    const refreshToken = randomBytes(48).toString("hex");
    const session = currentSessionId
      ? await this.prisma.authSession.update({ where: { id: currentSessionId }, data: { tokenHash: this.tokenHash(refreshToken), expiresAt: this.refreshExpiry() } })
      : await this.prisma.authSession.create({ data: { userId: user.id, tokenHash: this.tokenHash(refreshToken), expiresAt: this.refreshExpiry() } });
    const accessToken = this.jwt.sign({ sub: user.id, id: user.id, role: user.role, email: user.email ?? undefined });
    return { accessToken, refreshToken, expiresIn: "1d", sessionId: session.id, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } };
  }

  private refreshExpiry() { return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); }
  private tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
}
