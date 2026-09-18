import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { UserRole } from "../common/enums";
import { success } from "../common/api-response";
import { FinanceService } from "./finance.service";
import { PaymentProofDto } from "./dto/payment-proof.dto";
import { PaymentReviewDto } from "./dto/payment-review.dto";
import { CommissionDto } from "./dto/commission.dto";
import { PayoutStatusDto } from "./dto/payout-status.dto";

type RequestWithUser = { user: AuthenticatedUser };
const financeRoles = [UserRole.ADMIN, UserRole.FINANCE, UserRole.OPERATIONS];

@Controller()
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Post("bookings/:id/payment-proof")
  @UseGuards(JwtAuthGuard)
  async submitProof(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: PaymentProofDto) { return success(await this.finance.submitPaymentProof(req.user.id, id, input), "Payment proof submitted"); }

  @Get("admin/payments")
  @Roles(...financeRoles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async payments() { return success(await this.finance.listPayments(), "Payments fetched successfully"); }

  @Patch("admin/payments/:id/review")
  @Roles(...financeRoles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async reviewPayment(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: PaymentReviewDto) { return success(await this.finance.reviewPayment(req.user.id, id, input), "Payment review saved"); }

  @Post("admin/finance/commissions")
  @Roles(...financeRoles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async commission(@Req() req: RequestWithUser, @Body() input: CommissionDto) { return success(await this.finance.createCommission(req.user.id, input), "Commission created"); }

  @Get("admin/finance/bookings/:id")
  @Roles(...financeRoles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async bookingFinance(@Param("id") id: string) { return success(await this.finance.getBookingFinance(id), "Booking finance fetched successfully"); }

  @Get("admin/payouts")
  @Roles(...financeRoles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async payouts() { return success(await this.finance.listPayouts(), "Payouts fetched successfully"); }

  @Patch("admin/payouts/:id/status")
  @Roles(...financeRoles)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async payoutStatus(@Req() req: RequestWithUser, @Param("id") id: string, @Body() input: PayoutStatusDto) { return success(await this.finance.updatePayout(req.user.id, id, input), "Payout status updated"); }

  @Get("provider/finance")
  @Roles(UserRole.PROVIDER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async providerFinance(@Req() req: RequestWithUser) { return success(await this.finance.getProviderFinance(req.user.id), "Provider finance fetched successfully"); }
}
