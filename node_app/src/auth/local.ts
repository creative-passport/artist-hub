import { Router, Express } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';
import config from '../config';
import { User } from '../models/User';
import { csrfProtection } from '../csrf';

/**
 * An Authenticator which authenticates against a username and password
 * hardcoded in the environment
 */
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
          .insert({
            sub: username,
          })
          .onConflict('sub')
          .merge()
          .returning('*')
          .first();

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
    csrfProtection,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
    })
  );

  router.post('/logout', csrfProtection, (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  router.get('/', csrfProtection, (req, res) => {
    res.send({
      mode: 'local',
      signedIn: req.isAuthenticated(),
      csrfToken: req.csrfToken(),
    });
  });

  app.use('/auth', router);
};
