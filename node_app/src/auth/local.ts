import { Router, Express, Request, Response } from 'express';
import { Client, TokenSet, Strategy as OpenIDStrategy } from 'openid-client';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';
import config from '../config';

interface SerializedUser {
  username: string;
}

interface LocalUser extends Express.User {
  username: string;
}

interface SerializedUser {
  username: string;
}

function isLocalUser(user: Express.User): user is LocalUser {
  return (user as LocalUser).username !== undefined;
}

export class LocalAuthenticator {
  private constructor(app: Express) {
    if (
      config.authMode !== 'local' ||
      !config.localUsername ||
      !config.localPasswordHash
    ) {
      throw new Error('LOCAL_USERNAME and LOCAL_PASSWORD_HASH must be defined');
    }
    localSetupPassport(app, config.localUsername, config.localPasswordHash);
  }

  public static async create(app: Express): Promise<LocalAuthenticator> {
    return new LocalAuthenticator(app);
  }

  requireAuth = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && isLocalUser(req.user)) {
      return next();
    }
    return res.status(401).end();
  };
}

const localSetupPassport = (
  app: Express,
  adminUsername: string,
  passwordHash: string
) => {
  passport.use(
    'local',
    new LocalStrategy(async (username, password, done) => {
      if (
        username === adminUsername &&
        (await bcrypt.compare(password, passwordHash))
      ) {
        return done(null, { username });
      }
      return done(null, false);
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const router = Router();

  passport.serializeUser(function (user, done) {
    if (isLocalUser(user)) {
      done(null, {
        username: user.username,
      } as SerializedUser);
    } else {
      done(new Error('Not an valid user'));
    }
  });

  passport.deserializeUser(function (id: SerializedUser, done) {
    const user = {
      username: id.username,
    };
    done(null, user);
  });

  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
    })
  );

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  router.get('/', (req, res) => {
    res.send({
      mode: 'local',
      signedIn: req.isAuthenticated(),
      csrfToken: req.csrfToken(),
    });
  });

  app.use('/auth', router);
};
