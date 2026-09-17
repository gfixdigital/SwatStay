import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaymentStatus } from "../../common/enums";

export class PaymentReviewDto {
  @IsEnum(PaymentStatus) status!: PaymentStatus;
  @IsOptional() @IsString() reviewNote?: string;
}
