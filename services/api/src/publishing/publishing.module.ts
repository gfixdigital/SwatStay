import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CommonModule } from "../common/common.module";
import { DatabaseModule } from "../database/database.module";
import { PublishingController } from "./publishing.controller";
import { PublishingService } from "./publishing.service";

@Module({ imports: [AuthModule, CommonModule, DatabaseModule], controllers: [PublishingController], providers: [PublishingService] })
export class PublishingModule {}
