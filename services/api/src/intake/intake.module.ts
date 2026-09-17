import { Module } from "@nestjs/common";
import { IntakeController } from "./intake.controller";
import { IntakeService } from "./intake.service";

@Module({ controllers: [IntakeController], providers: [IntakeService] })
export class IntakeModule {}
