import { ClientKafka } from '@nestjs/microservices';
import { KafkaController } from './kafka.controller';

describe('KafkaController', () => {
  let kafkaController: KafkaController;
  let kafkaClient: Partial<ClientKafka>;

  beforeEach(() => {
    kafkaClient = {
      emit: jest.fn(),
    };

    kafkaController = new KafkaController(kafkaClient as ClientKafka);
  });

  it('should be defined', () => {
    expect(kafkaController).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send a message to Kafka and return success message', () => {
      const result = kafkaController.sendMessage();

      expect(kafkaClient.emit).toHaveBeenCalledWith('hello', {
        text: 'Hello World',
      });
      expect(result).toBe('Message sent to Kafka topic "hello"');
    });
  });
});
