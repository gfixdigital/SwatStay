import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateChangeRequestDto {
  @IsString() @IsNotEmpty() @MaxLength(80) changeType!: string;
  @IsString() @IsNotEmpty() @MaxLength(4000) message!: string;
  @IsOptional() @IsDateString() preferredCallbackAt?: string;
  @IsOptional() @IsIn(["NORMAL", "HIGH", "URGENT"]) priority?: string;
}
