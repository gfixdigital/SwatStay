import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BookingNoteDto {
  @IsNotEmpty() @IsString() @MaxLength(4000)
  note!: string;
}
