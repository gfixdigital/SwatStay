import { IsEnum, IsOptional, IsString } from "class-validator";
import { PayoutStatus } from "../../common/enums";

export class PayoutStatusDto {
  @IsEnum(PayoutStatus) status!: PayoutStatus;
  @IsOptional() @IsString() financeNote?: string;
}
