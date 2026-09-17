import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { success } from "../common/api-response";
import { ContactDto } from "./dto/contact.dto";
import { CustomTripDto } from "./dto/custom-trip.dto";
import { ProviderRegistrationDto } from "./dto/provider-registration.dto";
import { IntakeService } from "./intake.service";

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
}
