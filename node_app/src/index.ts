import 'dotenv/config';
import express from 'express';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { apiRouter } from './api/apiRouter';
import { setupPassport } from './auth/auth';
import config from './config';
import { csrfProtection } from './csrf';

(async () => {
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

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(csrfProtection);

  await setupPassport(app);

  app.use('/api', apiRouter);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
