import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { corsOptions } from './constants';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT=process.env.PORT || 8123;
  app.enableCors(corsOptions);
  await app.listen(PORT);
}
bootstrap();
