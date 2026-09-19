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
import { ProviderAssignmentDto } from "./dto/provider-assignment.dto";
import { ProviderDecisionDto } from "./dto/provider-decision.dto";
import { CreateChangeRequestDto } from "./dto/create-change-request.dto";
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

  @Get("admin/bookings/:id/provider-suggestions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS)
  async providerSuggestions(@Param("id") id: string) { return success(await this.bookings.providerSuggestions(id), "Provider suggestions fetched successfully"); }

  @Patch("admin/bookings/:id/provider-assignment")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS)
  async assignProvider(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: ProviderAssignmentDto) { return success(await this.bookings.assignProvider(req.user.id, id, input), "Provider assignment saved"); }

  @Post("admin/bookings/:id/provider-assignment/confirm")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS)
  async confirmProviderAssignments(@Req() req: RequestWithUser, @Param("id") id: string) { return success(await this.bookings.confirmProviderAssignments(req.user.id, id), "Provider assignment confirmed"); }

  @Get("provider/assignments")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  async providerAssignments(@Req() req: RequestWithUser) { return success(await this.bookings.providerAssignments(req.user.id), "Provider assignments fetched successfully"); }

  @Patch("provider/assignments/:itemId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  async providerDecision(@Req() req: RequestWithUser, @Param("itemId") itemId: string, @Body() input: ProviderDecisionDto) { return success(await this.bookings.providerDecision(req.user.id, itemId, input), "Provider assignment decision saved"); }

  @Post("bookings/:id/change-requests")
  @UseGuards(JwtAuthGuard)
  async createChangeRequest(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: CreateChangeRequestDto) { return success(await this.bookings.createChangeRequest(req.user.id, id, input), "Trip change request received"); }

  @Get("admin/change-requests")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async changeRequests() { return success(await this.bookings.changeRequests(), "Trip change requests fetched successfully"); }

  @Patch("admin/change-requests/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...adminBookingRoles)
  async updateChangeRequest(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: { status?: string; assignedTo?: string | null; resolutionNote?: string }) { return success(await this.bookings.updateChangeRequest(req.user.id, id, input), "Trip change request updated"); }

  @Get("admin/vouchers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT)
  async vouchers() { return success(await this.bookings.listVouchers(), "Vouchers fetched successfully"); }

  @Post("admin/vouchers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS)
  async createVoucher(@Req() req: RequestWithUser, @Body() input: { bookingId: string; payload: unknown }) { return success(await this.bookings.createVoucher(req.user.id, input.bookingId, input.payload), "Voucher created"); }

  @Patch("admin/vouchers/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS)
  async updateVoucher(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: { status?: string; payload?: unknown }) { return success(await this.bookings.updateVoucher(req.user.id, id, input), "Voucher updated"); }

  @Post("provider/vouchers/:code/scan")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  async scanVoucher(@Req() req: RequestWithUser, @Param("code") code: string, @Body("serviceId") serviceId?: string) { return success(await this.bookings.scanVoucher(req.user.id, code, serviceId), "Voucher scan accepted"); }
}
