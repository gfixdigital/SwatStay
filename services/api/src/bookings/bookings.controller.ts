import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post("request")
  async createBooking(@Body() dto: CreateBookingDto) {
    const booking = await this.bookingsService.create(dto);
    return {
      success: true,
      message: "Booking request received. Our team will call to confirm your trip details before providers are booked.",
      data: booking,
    };
  }

  @Get()
  async findAll(
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const result = await this.bookingsService.findAll({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    return {
      success: true,
      message: "Bookings fetched successfully",
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    const booking = await this.bookingsService.findById(id);
    if (!booking) {
      return { success: false, message: "Booking not found" };
    }
    return { success: true, message: "Booking fetched successfully", data: booking };
  }
}
