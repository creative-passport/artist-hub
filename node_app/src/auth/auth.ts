import { Express, Request, Response } from 'express';
import config from '../config';
import { LocalAuthenticator } from './local';
import { OIDCAuthenticator } from './oidc';

abstract class Authenticator {
  static create(app: Express): Promise<Authenticator> {
    throw new Error('Creator not defined');
  }
  abstract requireAuth(req: Request, res: Response, next: Function): void;
}

let authenticator: Authenticator;

export const requireAuth = (req: Request, res: Response, next: Function) => {
  if (authenticator) authenticator.requireAuth(req, res, next);
};

export const setupPassport = async (app: Express) => {
  switch (config.authMode) {
    case 'oidc':
      authenticator = await OIDCAuthenticator.create(app);
      break;
    case 'local':
      authenticator = await LocalAuthenticator.create(app);
      break;
  }
};
