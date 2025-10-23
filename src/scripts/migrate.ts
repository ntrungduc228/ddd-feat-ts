import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, closeDatabase } from '../shared/infrastructure/database/db.client.js';
import { logger } from '../shared/utils/logger.js';

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');

    await migrate(db, {
      migrationsFolder: './drizzle/migrations',
    });

    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

runMigrations();
