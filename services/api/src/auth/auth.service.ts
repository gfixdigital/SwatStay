import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "../common/enums";
import { PrismaService } from "../database/prisma.service";
import { compare, hash } from "bcryptjs";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async signup(input: SignupDto) {
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email: input.email }, { phone: input.phone }] } });
    if (existing) throw new ConflictException("An account with this email or phone already exists");
    const user = await this.prisma.user.create({
      data: { fullName: input.fullName, email: input.email, phone: input.phone, passwordHash: await hash(input.password, 12), role: UserRole.TOURIST, preferredLanguage: input.preferredLanguage },
    });
    return this.session(user);
  }

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user?.passwordHash || !user.isActive || !(await compare(input.password, user.passwordHash))) throw new UnauthorizedException("Invalid email or password");
    return this.session(user);
  }

  async me(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, fullName: true, email: true, phone: true, role: true, preferredLanguage: true, isActive: true } });
  }

  private session(user: { id: string; fullName: string; email: string | null; role: string }) {
    const accessToken = this.jwt.sign({ sub: user.id, id: user.id, role: user.role, email: user.email ?? undefined });
    return { accessToken, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } };
  }
}
