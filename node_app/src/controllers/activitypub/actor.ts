import express from 'express';
import config from '../../config';
import { asyncWrapper } from '../../asyncWrapper';
import { ArtistPage } from '../../models/ArtistPage';
import { acceptFollow, rejectFollow } from '../../activitypub/follow';
import { getActor } from '../../activitypub/actor';
import { PartialModelObject, UniqueViolationError } from 'objection';
import { APObject } from '../../models/APObject';
import { APAttachment } from '../../models/APAttachment';

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

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const videoMimeTypes = ['video/mp4'];

const supportedMimeTypes = [...imageMimeTypes, ...videoMimeTypes];

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

const asArray = <T extends unknown>(value: T[] | T) =>
  Array.isArray(value) ? value : [value];

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
      console.log(JSON.stringify(req.body, undefined, 2));

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
        case 'Create': {
          if (
            req.body.object &&
            req.body.object.type === 'Note' &&
            typeof req.body.object.id === 'string'
          ) {
            const actor = await getActor(req.body.actor);
            const object = req.body.object;

            let note: APObject | undefined = undefined;
            try {
              // Find or create note
              note = await actor
                .$relatedQuery('objects')
                .insert({
                  uri: object.id,
                  objectType: 'Note',
                  url: typeof object.url === 'string' ? object.url : undefined,
                  content:
                    typeof object.content === 'string'
                      ? object.content
                      : undefined,
                })
                .returning('*')
                .first();

              if (object.attachment) {
                let newAttachments: PartialModelObject<APAttachment>[] = [];
                for (const a of asArray(object.attachment)) {
                  if (newAttachments.length >= 4) {
                    break;
                  }

                  const newAttachment: PartialModelObject<APAttachment> = {
                    url: a.url,
                    type: a.type,
                    description: a.name,
                    mediaType: a.mediaType,
                    blurhash: a.blurhash,
                    thumbnailUrl: thumbnailUrlFromAttachment(a),
                  };
                  if (!supportedMimeTypes.includes(newAttachment.mediaType)) {
                    continue;
                  }
                  newAttachments.push(newAttachment);
                }
                if (newAttachments.length > 0) {
                  await note
                    .$relatedQuery('attachments')
                    .insert(newAttachments);
                }
              }
            } catch (err) {
              if (err instanceof UniqueViolationError) {
                note = await actor.$relatedQuery('objects').findOne({
                  uri: object.id,
                });
              } else {
                throw err;
              }
            }

            try {
              await note
                .$relatedQuery('deliveredActors')
                .relate(artistPage.apActor);
            } catch (err) {
              if (err instanceof UniqueViolationError) {
                // Already delivered
              } else {
                throw err;
              }
            }
            break;
          }
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

function thumbnailUrlFromAttachment(attachment: any): any {
  if (typeof attachment.icon === 'object' && attachment.icon !== null) {
    return attachment.icon.url;
  } else {
    return attachment.icon;
  }
}
