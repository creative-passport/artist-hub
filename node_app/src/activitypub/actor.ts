import express from 'express';
import config from '../config';
import { asyncWrapper } from '../asyncWrapper';
import { ArtistPage } from '../models/ArtistPage';

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
  };
}

const activityPubMimeTypes = [
  'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
  'application/activity+json',
];

export const activityPubRouter = express.Router();
activityPubRouter.use(
  express.json({
    type: activityPubMimeTypes,
  })
);

activityPubRouter.get(
  '/:username',
  asyncWrapper(async (req, res) => {
    const artistPage = await ArtistPage.query().findOne({
      username: req.params.username,
    });
    if (artistPage) {
      res.send(createActor(artistPage.username, artistPage.publicKey));
    } else {
      res.sendStatus(404);
    }
  })
);

activityPubRouter.post(
  '/:username/inbox',
  asyncWrapper(async (req, res) => {
    console.log(`Received message for user ${req.params.username}`);
    const artistPage = await ArtistPage.query().findOne({
      username: req.params.username,
    });
    if (artistPage) {
      console.log(`Received message for page ${req.params.username}`);
      // We don't support receiving messages yet...
      res.sendStatus(500);
    } else {
      console.log(
        `Received message for non-existant page ${req.params.username}`
      );
      res.sendStatus(404);
    }

    res.send(createActor(req.params.username, 'test'));
  })
);
