import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { success } from "../common/api-response";
import { AuthenticatedUser } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

type RequestWithUser = { user: AuthenticatedUser };

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  async getProfile(@Req() request: RequestWithUser) { return success(await this.users.getProfile(request.user.id), "Profile fetched successfully"); }

  @Get("me/bookings")
  async getBookings(@Req() request: RequestWithUser) { return success(await this.users.getBookings(request.user.id), "Bookings fetched successfully"); }

  @Patch("me")
  async updateProfile(@Req() request: RequestWithUser, @Body() input: UpdateProfileDto) { return success(await this.users.updateProfile(request.user.id, input), "Profile updated successfully"); }
}
