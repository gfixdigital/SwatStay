import { Body, Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { UserRole } from "../common/enums";
import { success } from "../common/api-response";
import { AdminDataService } from "./admin-data.service";
import { UpsertAdminRecordDto } from "./dto/upsert-admin-record.dto";

type RequestWithUser = { user: AuthenticatedUser };
const adminRoles = [UserRole.ADMIN, UserRole.OPERATIONS, UserRole.FINANCE, UserRole.SUPPORT];

@Controller("admin/data")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...adminRoles)
export class AdminDataController {
  constructor(private readonly adminData: AdminDataService) {}

  @Get(":recordKey")
  async get(@Param("recordKey") recordKey: string) { return success(await this.adminData.get(recordKey), "Admin record fetched successfully"); }

  @Put(":recordKey")
  async upsert(@Req() request: RequestWithUser, @Param("recordKey") recordKey: string, @Body() input: UpsertAdminRecordDto) { return success(await this.adminData.upsert(request.user.id, recordKey, input), "Admin record saved successfully"); }
}
