import { IsIn, IsOptional, IsString } from "class-validator";
import { PaymentStatus } from "../../common/enums";

export class PaymentReviewDto {
  @IsIn([PaymentStatus.VERIFIED, PaymentStatus.REJECTED]) status!: PaymentStatus;
  @IsOptional() @IsString() reviewNote?: string;
}
