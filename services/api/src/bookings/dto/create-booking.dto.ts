import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateBookingDto {
  @IsNotEmpty({ message: "Full name is required" })
  @IsString()
  @MaxLength(200)
  fullName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "A valid email address is required" })
  email!: string;

  @IsNotEmpty({ message: "Phone number is required" })
  @IsString()
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsNotEmpty({ message: "Destination is required" })
  @IsString()
  destination!: string;

  @IsNotEmpty({ message: "Travel start date is required" })
  travelStart!: string;

  @IsNotEmpty({ message: "Travel end date is required" })
  travelEnd!: string;

  @IsNotEmpty({ message: "Number of travelers is required" })
  @IsInt({ message: "Travelers must be a number" })
  @Min(1, { message: "At least 1 traveler is required" })
  travelersCount!: number;

  @IsOptional()
  @IsString()
  travelerType?: string;

  @IsOptional()
  @IsString()
  tier?: string;

  @IsNotEmpty({ message: "Pickup city is required" })
  @IsString()
  pickupCity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  specialRequests?: string;

  @IsOptional()
  @IsString()
  preferredPaymentMethod?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsNotEmpty({ message: "Package slug is required for package bookings" })
  @IsString()
  packageSlug!: string;

  @IsNotEmpty({ message: "Package title is required" })
  @IsString()
  packageTitle!: string;

  @IsNotEmpty({ message: "You must agree to the Terms and Conditions and Privacy Policy" })
  @IsBoolean({ message: "You must accept the terms and privacy policy" })
  consentAccepted!: boolean;
}
