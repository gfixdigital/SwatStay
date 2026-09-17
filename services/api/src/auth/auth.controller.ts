import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { AuthenticatedUser } from "./auth.types";

type RequestWithUser = { user: AuthenticatedUser };

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("signup") signup(@Body() input: SignupDto) { return this.auth.signup(input); }
  @Post("login") login(@Body() input: LoginDto) { return this.auth.login(input); }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() request: RequestWithUser) { return this.auth.me(request.user.id); }
}
