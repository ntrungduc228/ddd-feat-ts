import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { getDatabaseConfig } from './db.config.js';
import { logger } from '../../utils/logger.js';

const config = getDatabaseConfig();

const pool = new Pool({
  connectionString: config.url,
  max: config.max,
  idleTimeoutMillis: config.idleTimeoutMillis,
  connectionTimeoutMillis: config.connectionTimeoutMillis,
});

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', err);
});

// Test connection
pool.on('connect', () => {
  logger.info('Database connection established');
});

export const db = drizzle(pool);

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
  logger.info('Database connection closed');
};
