import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { success } from "../common/api-response";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingsService } from "./bookings.service";

type RequestWithOptionalUser = { user?: { id: string } };

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}
  @Post()
  async create(@Req() request: RequestWithOptionalUser, @Body() input: CreateBookingDto) { return success(await this.bookings.create(input, request.user?.id), "Booking request received"); }
}
