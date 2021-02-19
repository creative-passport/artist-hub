import { Router, Express } from 'express';
import { Client, TokenSet, Strategy as OpenIDStrategy } from 'openid-client';
import passport from 'passport';
import config from './config';

export const setupPassport = (app: Express, client: Client) => {
  passport.use(
    'oidc',
    new OpenIDStrategy(
      {
        client: client,
        params: {
          scope: 'openid offline',
          redirect_uri: `${config.baseUrl}/auth/return`,
        },
      },
      function (tokenset: TokenSet, userinfo: {}, done: Function) {
        return done(null, {
          sub: tokenset.claims().sub,
          tokenset: tokenset,
        });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const router = Router();

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    const user = {
      sub: (id as any).sub,
      tokenset: new TokenSet((id as any).tokenset),
    };
    done(null, user);
  });

  router.post('/login', passport.authenticate('oidc'));
  router.get(
    '/return',
    passport.authenticate('oidc', {
      successRedirect: '/',
      failureRedirect: '/login',
    })
  );

  router.post('/logout', (req, res) => {
    if (req.isAuthenticated()) {
      const logoutUrl = client.endSessionUrl({
        id_token_hint: req.user.tokenset,
      });
      req.session = null;
      res.redirect(logoutUrl);
    } else {
      res.redirect('/');
    }
  });

  router.get('/logged_out', (req, res) => {
    res.redirect('/');
  });

  router.get('/', (req, res) => {
    res.send({
      signedIn: req.isAuthenticated(),
      csrfToken: req.csrfToken(),
    });
  });

  app.use('/auth', router);
};
