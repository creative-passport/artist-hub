import { Express, NextFunction, Request, Response } from 'express';
import config from '../config';
import { LocalAuthenticator } from './local';
import { OIDCAuthenticator } from './oidc';
import passport from 'passport';
import { User } from '../models/User';

interface SerializedUser {
  userId: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated() && isUser(req.user)) {
    return next();
  }
  return res.status(401).end();
};

export function isUser(user: Express.User): user is User {
  return (user as User).sub !== undefined;
}

export const setupPassport = async (app: Express): Promise<void> => {
  passport.serializeUser(function (user, done) {
    if (isUser(user)) {
      done(null, { userId: user.id } as SerializedUser);
    } else {
      done(new Error('Not a valid user'));
    }
  });

  passport.deserializeUser(async function (sUser: SerializedUser, done) {
    const user = await User.query().findById(sUser.userId);
    done(null, user);
  });
  switch (config.authMode) {
    case 'oidc':
      await OIDCAuthenticator.create(app);
      break;
    case 'local':
      await LocalAuthenticator.create(app);
      break;
  }
};
