import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { success } from "../common/api-response";
import { ContactDto } from "./dto/contact.dto";
import { CustomTripDto } from "./dto/custom-trip.dto";
import { ProviderRegistrationDto } from "./dto/provider-registration.dto";
import { IntakeService } from "./intake.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../common/enums";
import { AuthenticatedUser } from "../auth/auth.types";

@Controller()
@Throttle({ default: { limit: 5, ttl: 900000 } })
export class IntakeController {
  constructor(private readonly intake: IntakeService) {}

  @Post("contact")
  async contact(@Body() input: ContactDto) { return success(await this.intake.contact(input), "Contact request received"); }

  @Post("custom-trips/request")
  async customTrip(@Body() input: CustomTripDto) { return success(await this.intake.customTrip(input), "Custom trip request received"); }

  @Post("providers/register")
  async providerRegistration(@Body() input: ProviderRegistrationDto) { return success(await this.intake.providerRegistration(input), "Provider registration received"); }

  @Get("admin/contact-submissions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT)
  async adminContacts() { return success(await this.intake.adminContacts(), "Contact submissions fetched successfully"); }

  @Patch("admin/contact-submissions/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.SUPPORT)
  async updateContact(@Req() request: { user: AuthenticatedUser }, @Param("id") id: string, @Body("status") status: string) { return success(await this.intake.updateContact(request.user.id, id, status), "Contact submission updated"); }
}
