const MONGODB_CONNECTION_URL: string | undefined =
  process.env.MONGODB_CONNECTION_URL;

export const mongoDbConfig: string = MONGODB_CONNECTION_URL
  ? MONGODB_CONNECTION_URL
  : 'mongodb://localhost:27017/nest';
