import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const baseServer = process.env.BASE_SERVER || 'http://localhost:3001';

  const config = new DocumentBuilder()
    .setTitle('Events Management API')
    .setDescription('The event API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(baseServer)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => console.error('Error during bootstrap:', err));
