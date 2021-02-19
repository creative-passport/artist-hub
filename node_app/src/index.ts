import 'dotenv/config';
import express from 'express';
import { Issuer, TokenSet } from 'openid-client';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { apiRouter } from './api/apiRouter';
import { setupPassport } from './passport';
import config from './config';
import { csrfProtection } from './csrf';

declare global {
  namespace Express {
    interface User {
      sub: string;
      tokenset: TokenSet;
    }
  }
}

(async () => {
  const issuer = await Issuer.discover(config.oidcDiscoveryUrl);
  const client = new issuer.Client({
    client_id: config.oidcClientId,
    client_secret: config.oidcSecret,
    post_logout_redirect_uris: [`${config.baseUrl}/auth/logged_out`],
  });

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

  setupPassport(app, client);

  app.get('/', (req, res) => {
    if (req.user) {
      const logoutUrl = client.endSessionUrl({
        id_token_hint: req.user.tokenset,
      });
      res.send(
        `Hello user: ${req.user.sub} ID token expires: ${req.user.tokenset.expires_at} Logout URL: ${logoutUrl}`
      );
    } else {
      res.send('Unauthenticated');
    }
  });

  app.use('/api', apiRouter);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
