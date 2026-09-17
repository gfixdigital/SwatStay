import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrivacyController } from "./privacy.controller";
import { PrivacyService } from "./privacy.service";

@Module({ imports: [AuthModule], controllers: [PrivacyController], providers: [PrivacyService], exports: [PrivacyService] })
export class PrivacyModule {}
