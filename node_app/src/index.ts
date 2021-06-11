import 'dotenv/config';
import { setupPassport } from './auth/auth';
import Knex from 'knex';
import knexConfig from './knexfile';
import { Model } from 'objection';
import { getRoutes } from './controllers';
// Import the app
import {app} from './app'

const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize knex.
const knex = Knex(knexConfig.development);
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

  const port = 4000;

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();