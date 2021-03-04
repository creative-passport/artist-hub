import { Router, Express, Request, Response } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';
import config from '../config';
import { User } from '../models/User';
import { isUser } from './auth';

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
    if (req.isAuthenticated() && isUser(req.user)) {
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
        const user = await User.query()
          .insertAndFetch({
            sub: username,
          })
          .onConflict('sub')
          .merge();

        return done(null, user);
      }
      return done(null, false);
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const router = Router();

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
