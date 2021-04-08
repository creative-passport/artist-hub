import express from 'express';
import config from '../../config';
import { asyncWrapper } from '../../asyncWrapper';
import { ArtistPage } from '../../models/ArtistPage';
import { acceptFollow, rejectFollow } from '../../activitypub/follow';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

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
  'application/ld+json"',
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
  })
);

activityPubRouter.post(
  '/:username/inbox',
  asyncWrapper(async (req, res) => {
    console.log(`Received message for user ${req.params.username}`);
    const artistPage = await ArtistPage.query()
      .findOne({
        username: req.params.username,
      })
      .withGraphFetched('apActor');
    if (artistPage) {
      console.log(`Received message for page ${req.params.username}`);
      console.log(req.headers);
      console.log(req.body);

      switch (req.body.type) {
        case 'Accept': {
          if (req.body.object) {
            await acceptFollow(
              typeof req.body.object === 'string'
                ? req.body.object
                : req.body.object.id,
              artistPage.apActor
            );
          }
          break;
        }
        case 'Reject': {
          if (req.body.object) {
            await rejectFollow(
              typeof req.body.object === 'string'
                ? req.body.object
                : req.body.object.id,
              artistPage.apActor
            );
          }
          break;
        }
        default:
          console.log('Unsupported message');
      }

      res.sendStatus(202);
    } else {
      console.log(
        `Received message for non-existant page ${req.params.username}`
      );
      res.sendStatus(404);
    }
  })
);
