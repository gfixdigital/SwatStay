import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { HealthController } from "./health/health.controller";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { RolesGuard } from "./auth/roles.guard";
import { UsersModule } from "./users/users.module";
import { PrivacyModule } from "./privacy/privacy.module";
import { AuditService } from "./common/audit.service";
import { RequestIdMiddleware } from "./common/request-id.middleware";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]), DatabaseModule, AuthModule, UsersModule, PrivacyModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    AuditService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) { consumer.apply(RequestIdMiddleware).forRoutes("*"); }
}
