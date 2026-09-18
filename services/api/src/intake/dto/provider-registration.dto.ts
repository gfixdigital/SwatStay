import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { ServiceType } from "@prisma/client";

export class ProviderRegistrationDto {
  @IsNotEmpty() @IsString() @MaxLength(160) businessName!: string;
  @IsNotEmpty() @IsString() @MaxLength(120) ownerName!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsNotEmpty() @IsString() phone!: string;
  @IsEnum(ServiceType) serviceCategory!: ServiceType;
  @IsNotEmpty() @IsString() location!: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsInt() @Min(1) @Max(10000) capacity?: number;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsBoolean() consent!: boolean;
}
