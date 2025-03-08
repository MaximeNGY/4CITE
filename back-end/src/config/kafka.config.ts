/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config';
import {
  KafkaOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

// ----- H E L P E R   F U N C T I O N S -----

export const createKafkaMicroserviceOptions = (
  configService: ConfigService,
): KafkaOptions => {
  const isProd = configService.get<string>('PRODUCTION') === '1';
  const kafkaBroker =
    configService.get<string>('KAFKA_BROKER_URL') || 'localhost:9092';
  const clientId = configService.get<string>('KAFKA_CLIENT_ID') || 'supmap';

  const kafkaClientOptions: any = {
    brokers: [kafkaBroker],
    clientId,
  };

  if (isProd) {
    kafkaClientOptions.ssl = true;
    kafkaClientOptions.sasl = {
      mechanism: (
        configService.get<string>('KAFKA_SASL_MECHANISMS') || 'plain'
      ).toLowerCase(),
      username: configService.get<string>('KAFKA_SASL_USERNAME'),
      password: configService.get<string>('KAFKA_SASL_PASSWORD'),
    };
  }

  const options: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
      client: kafkaClientOptions,
      consumer: { groupId: 'supmap-consumer' },
    },
  };

  return options;
};

// ----- M A I N   C O D E -----

const kafkaBroker = process.env.KAFKA_BROKER_URL ?? 'localhost:9092';

const kafkaClientOptions: any = {
  brokers: [kafkaBroker],
  clientId: process.env.KAFKA_CLIENT_ID ?? 'supmap',
};

if (process.env.KAFKA_SECURITY_PROTOCOL === 'SASL_SSL') {
  kafkaClientOptions.ssl = { rejectUnauthorized: false };
  kafkaClientOptions.sasl = {
    mechanism: (process.env.KAFKA_SASL_MECHANISMS || 'plain').toLowerCase(),
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  };
}

export const kafkaMicroserviceOptions: MicroserviceOptions = {
  transport: Transport.KAFKA,
  options: {
    client: kafkaClientOptions,
    consumer: {
      groupId: 'supmap-consumer',
    },
  },
};
