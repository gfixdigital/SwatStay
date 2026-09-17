import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Language } from "@prisma/client";

export class SignupDto {
  @IsNotEmpty() @IsString() fullName!: string;
  @IsEmail() email!: string;
  @IsNotEmpty() @IsString() phone!: string;
  @IsString() @MinLength(8) password!: string;
  @IsOptional() @IsEnum(Language) preferredLanguage?: Language;
}
