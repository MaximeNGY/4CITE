import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { DataSource } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export interface HealthReport {
  postgresConnection: string;
  mongooseConnection: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    @InjectConnection() private readonly mongooseConnection: Connection,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check API and microservices health',
    description:
      'Returns the health status of both the PostgreSQL (TypeORM) and MongoDB (Mongoose) connections.',
  })
  @ApiResponse({
    status: 200,
    description: 'Both connections are healthy',
    schema: {
      example: {
        postgresConnection: 'healthy',
        mongooseConnection: 'healthy',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal server error - either the TypeORM or Mongoose connection failed',
  })
  async checkHealth(): Promise<HealthReport> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new HttpException(
        { message: 'TypeORM database connection failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (this.mongooseConnection.readyState !== ConnectionStates.connected) {
      throw new HttpException(
        {
          message: 'Mongoose connection failed',
          readyState: this.mongooseConnection.readyState,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { postgresConnection: 'healthy', mongooseConnection: 'healthy' };
  }
}
