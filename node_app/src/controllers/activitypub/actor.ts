import express from 'express';
import config from '../../config';
import { asyncWrapper } from '../asyncWrapper';
import { ArtistPage } from '../../models/ArtistPage';
import { inbox } from '../../activitypub/inbox';

export interface Actor {
  '@context': string[];

  id: string;
  type: string;
  preferredUsername: string;
  inbox: string;

  publicKey?: {
    id: string;
    owner: string;
    publicKeyPem: string;
  };

  sharedInbox: string;
}

export function getActorRoutes() {
  const router = express.Router({ mergeParams: true });
  router.get('/', artist);
  router.post('/inbox', postInbox);
  return router;
}

export function createActor(username: string, publicKey: string): Actor {
  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1',
    ],
    id: `${config.baseUrl}/p/${username}`,
    type: 'Person',
    preferredUsername: username,
    inbox: `${config.baseUrl}/p/${username}/inbox`,
    publicKey: {
      id: `${config.baseUrl}/p/${username}#main-key`,
      owner: `${config.baseUrl}/p/${username}`,
      publicKeyPem: publicKey,
    },
    sharedInbox: `${config.baseUrl}/sharedInbox`,
  };
}

const artist = asyncWrapper(async (req, res) => {
  const artistPage = await ArtistPage.query()
    .findOne({
      username: req.params.username,
    })
    .withGraphFetched('apActor');
  if (artistPage) {
    const actor = createActor(
      artistPage.username,
      artistPage.apActor.publicKey
    );
    console.log(actor);
    res.type('application/activity+json');
    res.send(createActor(artistPage.username, artistPage.apActor.publicKey));
  } else {
    res.sendStatus(404);
  }
});

const postInbox = asyncWrapper(async (req, res) => {
  console.log(`Received message for user ${req.params.username}`);
  const artistPage = await ArtistPage.query()
    .findOne({
      username: req.params.username,
    })
    .withGraphFetched('apActor');
  if (artistPage) {
    console.log(`Received message for page ${req.params.username}`);
    console.log('Headers', req.headers);
    await inbox(req.body, artistPage.apActor);

    res.sendStatus(202);
  } else {
    console.log(
      `Received message for non-existant page ${req.params.username}`
    );
    res.sendStatus(404);
  }
});
