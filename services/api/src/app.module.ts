import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PrivacyModule } from "./privacy/privacy.module";
import { CommonModule } from "./common/common.module";
import { RequestIdMiddleware } from "./common/request-id.middleware";
import { IntakeModule } from "./intake/intake.module";
import { SupportModule } from "./support/support.module";
import { FinanceModule } from "./finance/finance.module";
import { PackagesModule } from "./packages/packages.module";
import { BookingsModule } from "./bookings/bookings.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]), CommonModule, DatabaseModule, AuthModule, UsersModule, PrivacyModule, IntakeModule, SupportModule, FinanceModule, PackagesModule, BookingsModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(RequestIdMiddleware).forRoutes("*"); }
}
