import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Matches, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { PackageItemDto } from "./package-item.dto";

export class CreatePackageDto {
  @IsNotEmpty() @IsString() @MaxLength(160) name!: string;
  @IsNotEmpty() @IsString() @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) slug!: string;
  @IsNotEmpty() @IsString() destinationId!: string;
  @IsOptional() @IsString() @MaxLength(2000) summary?: string;
  @IsOptional() @IsString() @MaxLength(40) packageType?: string;
  @IsOptional() @IsString() @MaxLength(40) tier?: string;
  @IsOptional() @IsString() @MaxLength(300) route?: string;
  @IsInt() @Min(1) @Max(60) durationDays!: number;
  @IsInt() @Min(1) basePrice!: number;
  @IsOptional() @IsString() @MaxLength(10) currency?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() gallery?: string[];
  @IsOptional() @IsObject() itinerary?: Record<string, unknown>;
  @IsOptional() @IsString() @MaxLength(1000) cancellationSummary?: string;
  @IsOptional() @IsString() @MaxLength(160) seoTitle?: string;
  @IsOptional() @IsString() @MaxLength(300) seoDescription?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => PackageItemDto) items!: PackageItemDto[];
}
