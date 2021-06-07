import 'dotenv/config';
import Knex from 'knex';
import knexConfig from './knexfile';
import { Model } from 'objection';
import { getApp } from './app';

const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize knex.
const knex = Knex(knexConfig.production);
Model.knex(knex);

(async () => {
  if (isDevelopment) {
    await import('mac-ca');
  }
  const [, pending] = await knex.migrate.list({
    directory: './src/migrations',
  });
  if (pending.length > 0) {
    console.error(`Pending migrations`);
    console.error(pending.join('\n'));
    throw new Error('Migrations pending');
  }

  const app = await getApp();
  const port = 4000;

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
