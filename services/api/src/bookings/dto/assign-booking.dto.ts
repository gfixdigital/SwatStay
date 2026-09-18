import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class AssignBookingDto {
  @IsNotEmpty() @IsString()
  memberId!: string;

  @IsOptional() @IsString() @MaxLength(1000)
  reason?: string;
}
