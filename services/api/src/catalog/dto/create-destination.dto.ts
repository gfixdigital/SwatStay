import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateDestinationDto {
  @IsNotEmpty() @IsString() @MaxLength(80) name!: string;
  @IsNotEmpty() @IsString() @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) slug!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
