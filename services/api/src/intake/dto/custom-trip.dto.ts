import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsBoolean, Max, Min, MaxLength } from "class-validator";

export class CustomTripDto {
  @IsNotEmpty() @IsString() @MaxLength(120) name!: string;
  @IsEmail() email!: string;
  @IsNotEmpty() @IsString() phone!: string;
  @IsNotEmpty() @IsString() destination!: string;
  @IsOptional() @IsDateString() travelStart?: string;
  @IsOptional() @IsDateString() travelEnd?: string;
  @IsInt() @Min(1) @Max(100) travelers!: number;
  @IsNotEmpty() @IsString() pickupCity!: string;
  @IsOptional() @IsString() accommodation?: string;
  @IsOptional() @IsString() interests?: string;
  @IsOptional() @IsString() budget?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsBoolean() consent!: boolean;
}
