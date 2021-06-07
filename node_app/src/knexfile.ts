import { knexSnakeCaseMappers } from 'objection';

/**
 * The Knex database configuration
 */

const database = process.env.PGDATABASE || 'artisthub';
const host = process.env.PGHOST || 'localhost';
const port = process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432;
const user = process.env.PGUSER || 'artisthub';
const password = process.env.PGPASSWORD;

export default {
  production: {
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
    ...knexSnakeCaseMappers(),
  },

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
    ...knexSnakeCaseMappers(),
  },
};

// console.log(database);

// export default database;
