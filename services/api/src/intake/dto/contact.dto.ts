import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class ContactDto {
  @IsNotEmpty() @IsString() @MaxLength(120) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(160) subject?: string;
  @IsNotEmpty() @IsString() @MaxLength(2000) message!: string;
  @IsBoolean() consent!: boolean;
}
