import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateDestinationDto {
  @IsNotEmpty() @IsString() @MaxLength(80) name!: string;
  @IsNotEmpty() @IsString() @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) slug!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsString() @MaxLength(300) shortDescription?: string;
  @IsOptional() @IsString() @MaxLength(2000) fullDescription?: string;
  @IsOptional() bestFor?: string | string[];
  @IsOptional() @IsString() @MaxLength(100) travelTime?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() seoTitle?: string;
  @IsOptional() @IsString() seoDescription?: string;
  @IsOptional() popularServices?: string[];
  @IsOptional() gallery?: string[];
}
