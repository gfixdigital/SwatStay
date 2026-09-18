import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CommissionDto {
  @IsString() bookingId!: string;
  @IsOptional() @IsString() bookingItemId?: string;
  @IsString() providerId!: string;
  @Min(0) @Max(100) rate!: number;
  @IsInt() @Min(1) grossAmount!: number;
}
