import express, { Express } from 'express';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import { setupPassport } from './auth/auth';
import config from './config';
import morgan from 'morgan';
import { getRoutes } from './controllers';

export async function getApp(): Promise<Express> {
  const app = express();

  app.use(morgan('combined'));
  app.set('trust proxy', true);

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

  app.use(getRoutes());
  return app;
}
