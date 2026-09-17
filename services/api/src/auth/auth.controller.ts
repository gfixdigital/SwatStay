import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { AuthenticatedUser } from "./auth.types";

type RequestWithUser = { user: AuthenticatedUser };

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("signup") signup(@Body() input: SignupDto) { return this.auth.signup(input); }
  @Post("login") login(@Body() input: LoginDto) { return this.auth.login(input); }
  @Post("refresh") refresh(@Body() input: RefreshDto) { return this.auth.refresh(input.refreshToken); }
  @Post("logout") logout(@Body() input: RefreshDto) { return this.auth.logout(input.refreshToken); }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() request: RequestWithUser) { return this.auth.me(request.user.id); }
}
