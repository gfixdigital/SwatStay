import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ServiceType } from "../../common/enums";

export class ProviderAssignmentDto {
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsString()
  @IsNotEmpty()
  providerId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
