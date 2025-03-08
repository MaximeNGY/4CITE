import { DataSource } from 'typeorm';
import { Role } from '../auth/rbac/role/role.entity';
import { User } from '../users/users.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  url: process.env.DATABASE_CONNECTION_URL,
  logging: true,
  entities: [User, Role],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
