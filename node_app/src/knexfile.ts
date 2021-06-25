import { knexSnakeCaseMappers } from 'objection';
import { Knex } from 'knex';
import { CustomFsMigrations } from './knex/customFsMigrations';
import path from 'path';

/**
 * The Knex database configuration
 */

const database = process.env.PGDATABASE || 'artisthub';
const host = process.env.PGHOST || 'localhost';
const port = process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432;
const user = process.env.PGUSER;
const password = process.env.PGPASSWORD;

const migratorConfig: Knex.MigratorConfig = {
  migrationSource: new CustomFsMigrations(path.join(__dirname, 'migrations')),
};

const devProdConfig = {
  client: 'pg',
  connection: {
    database,
    host,
    port,
    user,
    password,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: migratorConfig,
  ...knexSnakeCaseMappers(),
};

export default {
  development: devProdConfig,
  production: devProdConfig,

  testing: {
    client: 'pg',
    connection: {
      database: process.env.TEST_PGDATABASE || 'artisthub_test_database',
      host,
      port,
      user,
      password,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: migratorConfig,
    ...knexSnakeCaseMappers(),
  },
};
