import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { createKafkaMicroserviceOptions } from 'src/config/kafka.config';
import { KafkaController } from './kafka.controller';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          createKafkaMicroserviceOptions(configService),
      },
    ]),
  ],
  controllers: [KafkaController],
  exports: [ClientsModule],
})
export class KafkaModule {}
