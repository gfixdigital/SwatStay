import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "node:path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: config.get<string>("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:3002").split(","),
    credentials: true,
  });
  const localStorageDir = config.get<string>("LOCAL_STORAGE_DIR", join(process.cwd(), "uploads"));
  app.useStaticAssets(localStorageDir, { prefix: "/storage/" });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(config.get<number>("PORT", 4000));
}

void bootstrap();