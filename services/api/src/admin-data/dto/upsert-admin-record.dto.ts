import { IsDefined } from "class-validator";

export class UpsertAdminRecordDto {
  @IsDefined()
  payload!: unknown;
}
