import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { UserRole } from "../common/enums";
import { success } from "../common/api-response";
import { AdminBookingPaymentStatusDto, AdminBookingStatusDto } from "./dto/admin-booking-status.dto";
import { AssignBookingDto } from "./dto/assign-booking.dto";
import { BookingNoteDto } from "./dto/booking-note.dto";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingsService } from "./bookings.service";

type RequestWithOptionalUser = { user?: { id: string } };
type RequestWithUser = { user: AuthenticatedUser };
const adminBookingRoles = [UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT];

@Controller()
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}
  @Post("bookings")
  async create(@Req() request: RequestWithOptionalUser, @Body() input: CreateBookingDto) { return success(await this.bookings.create(input, request.user?.id), "Booking request received"); }

  @Get("admin/bookings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async adminList() { return success(await this.bookings.adminList(), "Admin bookings fetched successfully"); }

  @Get("admin/bookings/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async adminDetail(@Param("id") id: string) { return success(await this.bookings.adminDetail(id), "Admin booking fetched successfully"); }

  @Get("admin/team-members")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async teamMembers() { return success(await this.bookings.teamMembers(), "Team members fetched successfully"); }

  @Patch("admin/bookings/:id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async setStatus(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: AdminBookingStatusDto) { return success(await this.bookings.setStatus(req.user.id, id, input.status), "Booking status updated"); }

  @Patch("admin/bookings/:id/payment-status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.FINANCE, UserRole.OPERATIONS)
  async setPaymentStatus(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: AdminBookingPaymentStatusDto) { return success(await this.bookings.setPaymentStatus(req.user.id, id, input.paymentStatus), "Booking payment status updated"); }

  @Patch("admin/bookings/:id/assignment")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async assign(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: AssignBookingDto) { return success(await this.bookings.assign(req.user.id, id, input), "Booking team member assigned"); }

  @Post("admin/bookings/:id/notes")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async addNote(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: BookingNoteDto) { return success(await this.bookings.addNote(req.user.id, id, input.note), "Booking note added"); }
}
