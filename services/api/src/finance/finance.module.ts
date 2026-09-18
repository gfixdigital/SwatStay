import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CommonModule } from "../common/common.module";
import { DatabaseModule } from "../database/database.module";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";

@Module({ imports: [AuthModule, CommonModule, DatabaseModule], controllers: [FinanceController], providers: [FinanceService] })
export class FinanceModule {}
