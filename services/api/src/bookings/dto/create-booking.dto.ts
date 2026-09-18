import { IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { Language } from "../../common/enums";

export class CreateBookingDto {
  @IsNotEmpty() @IsString() @MaxLength(120) fullName!: string;
  @IsEmail() email!: string;
  @IsNotEmpty() @IsString() phone!: string;
  @IsOptional() @IsEnum(Language) preferredLanguage: Language = Language.EN;
  @IsOptional() @IsString() packageSlug?: string;
  @IsNotEmpty() @IsString() destination!: string;
  @IsDateString() travelStart!: string;
  @IsDateString() travelEnd!: string;
  @IsInt() @Min(1) @Max(100) travelersCount!: number;
  @IsNotEmpty() @IsString() pickupCity!: string;
  @IsOptional() @IsString() @MaxLength(2000) specialRequests?: string;
  @IsBoolean() consent!: boolean;
}
