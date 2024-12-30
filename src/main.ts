import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Tooty Backend')
    .setDescription('Educational Bot API Backend')
    .setVersion('1.0')
    .addTag('tooty')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = Number(process.env.PORT) ?? 3001;
  const host = process.env.HOST || '0.0.0.0'; // Default to 0.0.0.0 to bind to all available IPs

  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}
bootstrap();
