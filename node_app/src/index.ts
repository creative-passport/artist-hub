import 'dotenv/config';
import express from 'express';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import { apiRouter } from './api/apiRouter';
import { setupPassport } from './auth/auth';
import config from './config';
import { csrfProtection } from './csrf';
import Knex from 'knex';
import knexConfig from './knexfile';
import { Model } from 'objection';
import { activityPubRouter } from './controllers/activitypub/actor';
import { webfingerHandler } from './webfinger';

const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

(async () => {
  if (isDevelopment) {
    await import('mac-ca');
  }
  const app = express();
  const port = 4000;

  app.use(
    cookieSession({
      name: 'session',
      keys: [config.cookieSecret],

      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );

  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  await setupPassport(app);

  app.use('/api', csrfProtection, apiRouter);
  app.use('/p', activityPubRouter);
  app.get(
    '/.well-known/webfinger',
    express.json({ type: ['application/jrd+json', 'application/json'] }),
    webfingerHandler
  );

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
