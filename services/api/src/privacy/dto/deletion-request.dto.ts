import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class DeletionRequestDto {
  @IsNotEmpty() @IsString() email!: string;
  @IsOptional() @IsString() @MaxLength(500) reason?: string;
}
