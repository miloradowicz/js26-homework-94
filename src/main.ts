import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useStaticAssets(join(config.rootPath, config.publicPath));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.server.port);
}

bootstrap().catch(console.error);
