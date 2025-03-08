import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { kafkaMicroserviceOptions } from './config/kafka.config';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Supmap API')
    .setDescription('Discover the SUPMAP API')
    .setVersion('1.0')
    .addTag('supmap')
    .build();

  console.log('Running database migrations...');
  await AppDataSource.initialize()
    .then(async () => {
      await AppDataSource.runMigrations();
      console.log('✅ Migrations applied successfully!');
    })
    .catch((error) => {
      console.error('❌ Migration error:', error);
    });

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
    customSiteTitle: 'Supmap API Documentation',
    customfavIcon: '/favicon.ico',
  });

  app.connectMicroservice(kafkaMicroserviceOptions);
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
