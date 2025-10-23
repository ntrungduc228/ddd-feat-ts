import { config } from 'dotenv';

config();

export interface DatabaseConfig {
  url: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return {
    url: databaseUrl,
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
  };
};
