import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(config.rootPath, config.publicPath));
  await app.listen(config.server.port);
}

bootstrap().catch(console.error);
