import { Router, Express, Request, Response } from 'express';
import {
  Client,
  TokenSet,
  Strategy as OpenIDStrategy,
  Issuer,
} from 'openid-client';
import passport from 'passport';
import config from '../config';

interface OIDCUser extends Express.User {
  sub: string;
  tokenset: TokenSet;
}

interface SerializedUser {
  sub: string;
  id_token?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_at?: number;
}

function isOIDCUser(user: Express.User): user is OIDCUser {
  return (user as OIDCUser).sub !== undefined;
}

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
    if (
      req.isAuthenticated() &&
      isOIDCUser(req.user) &&
      req.user.tokenset.claims()
    ) {
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
    if (isOIDCUser(user)) {
      done(null, {
        sub: user.sub,
        id_token: user.tokenset.id_token,
        access_token: user.tokenset.access_token,
        refresh_token: user.tokenset.refresh_token,
        token_type: user.tokenset.token_type,
        expires_at: user.tokenset.expires_at,
      } as SerializedUser);
    } else {
      done(new Error('Not an OIDC user'));
    }
  });

  passport.deserializeUser(function (id: SerializedUser, done) {
    const user = {
      sub: id.sub,
      tokenset: new TokenSet({
        id_token: id.id_token,
        access_token: id.access_token,
        refresh_token: id.refresh_token,
        token_type: id.token_type,
        expires_at: id.expires_at,
      }),
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
    if (req.isAuthenticated() && isOIDCUser(req.user)) {
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
