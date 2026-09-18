import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ServiceType } from "../../common/enums";

export class PackageItemDto {
  @IsEnum(ServiceType) serviceType!: ServiceType;
  @IsNotEmpty() @IsString() @MaxLength(160) title!: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
}
