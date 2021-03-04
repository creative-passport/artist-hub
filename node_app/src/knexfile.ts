import { knexSnakeCaseMappers } from 'objection';

const database = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    ...knexSnakeCaseMappers(),
  },
};

export default database;
