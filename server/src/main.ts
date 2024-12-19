import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // nest app
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // env config
  config({ path: resolve(__dirname, '../.env') });

  // port
  const PORT = process.env.PORT || 3000;

  // cors setup
  app.enableCors()

  // start app
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();