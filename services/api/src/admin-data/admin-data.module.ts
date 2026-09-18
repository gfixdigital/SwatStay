import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AdminDataController } from "./admin-data.controller";
import { AdminDataService } from "./admin-data.service";

@Module({ imports: [AuthModule], controllers: [AdminDataController], providers: [AdminDataService] })
export class AdminDataModule {}
