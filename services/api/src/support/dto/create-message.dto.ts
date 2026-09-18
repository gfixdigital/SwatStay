import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty() @IsString() @MaxLength(4000) body!: string;
  @IsOptional() @IsString() audience?: string;
}
