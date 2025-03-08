import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class KafkaController {
  private readonly logger = new Logger(KafkaController.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  @Get('r/hello')
  @ApiOperation({
    summary: 'Send realtime Hello World message to Kafka',
    description:
      'This endpoint (prefixed with "r" for realtime) sends a "Hello World" message to the Kafka topic "hello".',
  })
  @ApiResponse({
    status: 200,
    description: 'Message successfully sent to Kafka topic "hello".',
  })
  sendMessage() {
    this.kafkaClient.emit('hello', { text: 'Hello World' });
    return 'Message sent to Kafka topic "hello"';
  }
}
