import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:4000', // React app's URL
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // If you need to send cookies or credentials
  });

  await app.listen(3000);
}
bootstrap();
