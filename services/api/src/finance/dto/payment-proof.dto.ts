import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaymentProofDto {
  @Type(() => Number) @IsInt() @Min(1) amount!: number;
  @IsString() method!: string;
  @IsOptional() @IsString() transactionReference?: string;
  @IsOptional() @IsString() proofUrl?: string;
  @IsOptional() @IsString() notes?: string;
}
