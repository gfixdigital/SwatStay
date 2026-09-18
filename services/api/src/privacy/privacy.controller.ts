import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthenticatedUser } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { success } from "../common/api-response";
import { DeletionRequestDto } from "./dto/deletion-request.dto";
import { PrivacyService } from "./privacy.service";

type RequestWithUser = { user: AuthenticatedUser };

@Controller("privacy")
@UseGuards(JwtAuthGuard)
export class PrivacyController {
  constructor(private readonly privacy: PrivacyService) {}

  @Post("data-deletion")
  async requestDeletion(@Req() request: RequestWithUser, @Body() input: DeletionRequestDto) { return success(await this.privacy.createDeletionRequest(request.user.id, input), "Data deletion request received"); }

  @Get("consents")
  async consentHistory(@Req() request: RequestWithUser) { return success(await this.privacy.getConsentHistory(request.user.id), "Consent history fetched successfully"); }
}
