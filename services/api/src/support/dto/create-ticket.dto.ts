import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTicketDto {
  @IsOptional() @IsEmail() guestEmail?: string;
  @IsNotEmpty() @IsString() @MaxLength(160) subject!: string;
  @IsNotEmpty() @IsString() issueType!: string;
  @IsOptional() @IsString() message?: string;
}
