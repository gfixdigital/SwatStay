import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class PaymentProofDto {
  @IsInt() @Min(1) amount!: number;
  @IsString() method!: string;
  @IsOptional() @IsString() transactionReference?: string;
  @IsOptional() @IsString() proofUrl?: string;
  @IsOptional() @IsString() notes?: string;
}
