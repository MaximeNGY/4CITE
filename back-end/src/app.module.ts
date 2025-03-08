import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MapboxModule } from './mapbox/mapbox.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoDbConfig } from './config/mongodb.config';
import { KafkaModule } from './kafka/kafka.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    MapboxModule,
    StorageModule,
    UsersModule,
    KafkaModule,
    DatabaseModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(mongoDbConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
