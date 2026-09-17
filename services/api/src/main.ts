import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: config.get<string>("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:3002").split(","),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(config.get<number>("PORT", 4000));
}

void bootstrap();
