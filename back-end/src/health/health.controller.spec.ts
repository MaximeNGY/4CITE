import { HttpException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, ConnectionStates } from 'mongoose';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let dataSourceMock: Partial<DataSource>;
  let mongooseConnectionMock: Partial<Connection>;

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn().mockResolvedValue([1]),
    };

    mongooseConnectionMock = {} as Partial<Connection>;

    Object.defineProperty(mongooseConnectionMock, 'readyState', {
      get: () => ConnectionStates.connected,
      configurable: true,
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: DataSource, useValue: dataSourceMock },
        { provide: getConnectionToken(), useValue: mongooseConnectionMock },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a healthy status if database is connected', async () => {
    (dataSourceMock.query as jest.Mock).mockResolvedValue([1]);

    Object.defineProperty(mongooseConnectionMock, 'readyState', {
      get: () => ConnectionStates.connected,
      configurable: true,
    });

    const result = await controller.checkHealth();
    expect(result).toEqual({
      postgresConnection: 'healthy',
      mongooseConnection: 'healthy',
    });
  });

  it('should throw an error if TypeORM database connection fails', async () => {
    (dataSourceMock.query as jest.Mock).mockRejectedValue(
      new Error('DB Error'),
    );

    await expect(controller.checkHealth()).rejects.toThrow(HttpException);
    await expect(controller.checkHealth()).rejects.toThrow(
      'TypeORM database connection failed',
    );
  });

  it('should throw an error if Mongoose connection is not healthy', async () => {
    (dataSourceMock.query as jest.Mock).mockResolvedValue([1]);

    Object.defineProperty(mongooseConnectionMock, 'readyState', {
      get: () => ConnectionStates.disconnected,
      configurable: true,
    });

    await expect(controller.checkHealth()).rejects.toThrow(HttpException);
    await expect(controller.checkHealth()).rejects.toThrow(
      'Mongoose connection failed',
    );
  });
});
