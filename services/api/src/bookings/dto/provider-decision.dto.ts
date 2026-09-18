import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { AssignmentStatus } from "../../common/enums";

export class ProviderDecisionDto {
  @IsEnum(AssignmentStatus)
  status!: AssignmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
