import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
