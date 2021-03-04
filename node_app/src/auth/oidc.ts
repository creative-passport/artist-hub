import { Router, Express, Request, Response } from 'express';
import {
  Client,
  TokenSet,
  Strategy as OpenIDStrategy,
  Issuer,
} from 'openid-client';
import passport from 'passport';
import config from '../config';
import { User } from '../models/User';
import { isUser } from './auth';

export class OIDCAuthenticator {
  client: Client;
  providerName: string;

  private constructor(
    app: Express,
    client: Client,
    providerName: string,
    helpText?: string
  ) {
    this.client = client;
    this.providerName = providerName;
    oidcSetupPassport(app, client, providerName, helpText);
  }

  public static async create(app: Express): Promise<OIDCAuthenticator> {
    if (config.authMode !== 'oidc') {
      throw new Error('Invalid auth mode');
    }
    const issuer = await Issuer.discover(config.oidcDiscoveryUrl);
    const client = new issuer.Client({
      client_id: config.oidcClientId,
      client_secret: config.oidcSecret,
      post_logout_redirect_uris: [`${config.baseUrl}/auth/logged_out`],
    });
    return new OIDCAuthenticator(
      app,
      client,
      config.oidcProviderName,
      config.oidcHelpText
    );
  }

  requireAuth = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && isUser(req.user)) {
      return next();
    }
    return res.status(401).end();
  };
}

const oidcSetupPassport = (
  app: Express,
  client: Client,
  providerName: string,
  helpText?: string
) => {
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
      async function (tokenset: TokenSet, userinfo: {}, done: Function) {
        if (tokenset.claims()) {
          const user = await User.query()
            .insertAndFetch({
              sub: tokenset.claims().sub,
              idToken: tokenset.id_token,
              accessToken: tokenset.access_token,
              refreshToken: tokenset.refresh_token,
              tokenType: tokenset.token_type,
              expiresAt: tokenset.expires_at,
              updatedAt: new Date(),
            })
            .onConflict('sub')
            .merge();

          return done(null, user);
        } else {
          return done(new Error('No OIDC id token claims.'));
        }
      }
    )
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const router = Router();

  router.post('/login', passport.authenticate('oidc'));
  router.get(
    '/return',
    passport.authenticate('oidc', {
      successRedirect: '/',
      failureRedirect: '/login',
    })
  );

  router.post('/logout', (req, res) => {
    if (req.isAuthenticated() && isUser(req.user)) {
      const logoutUrl = client.endSessionUrl({
        id_token_hint: req.user.tokenset,
      });
      req.session = null;
      res.redirect(logoutUrl);
    } else {
      req.session = null;
      res.redirect('/');
    }
  });

  router.get('/logged_out', (req, res) => {
    res.redirect('/');
  });

  router.get('/', (req, res) => {
    res.send({
      mode: 'oidc',
      oidc: {
        providerName,
        helpText,
      },
      signedIn: req.isAuthenticated(),
      csrfToken: req.csrfToken(),
    });
  });

  app.use('/auth', router);
};
