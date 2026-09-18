import { Module } from "@nestjs/common";
import { AdminDataController } from "./admin-data.controller";
import { AdminDataService } from "./admin-data.service";

@Module({ controllers: [AdminDataController], providers: [AdminDataService] })
export class AdminDataModule {}
