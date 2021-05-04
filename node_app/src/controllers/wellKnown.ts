import { asyncWrapper } from './asyncWrapper';
import config from '../config';
import { ArtistPage } from '../models/ArtistPage';
import express, { Router } from 'express';
import Debug from 'debug';
const debug = Debug('artisthub:wellknown');

export function getWellKnownRoutes(): Router {
  const router = express.Router();
  router.get(
    '/webfinger',
    express.json({ type: ['application/jrd+json', 'application/json'] }),
    getWebfinger
  );
  return router;
}

function createWebfinger(username: string) {
  return {
    subject: `acct:${username}@${config.domain}`,
    aliases: [`${config.baseUrl}/p/${username}`],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page',
        type: 'text/html',
        href: `${config.baseUrl}/p/${username}`,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `${config.baseUrl}/p/${username}`,
      },
    ],
  };
}

const getWebfinger = asyncWrapper(async (req, res) => {
  debug('webfinger request');
  const resource = req.query.resource;
  if (
    !resource ||
    typeof resource !== 'string' ||
    !resource.startsWith('acct:')
  ) {
    res.sendStatus(500);
    return;
  }
  const resourceWithoutAccount = resource.replace(/^acct:/, '');
  const [user, domain] = resourceWithoutAccount.split('@');
  if (domain !== config.domain) {
    res.sendStatus(500);
  }

  const artistPage = await ArtistPage.query().findOne({
    username: user,
  });
  if (artistPage) {
    const webfinger = createWebfinger(artistPage.username);
    debug(webfinger);
    res.type('application/jrd+json');
    res.send(webfinger);
  } else {
    res.sendStatus(500);
  }
});
