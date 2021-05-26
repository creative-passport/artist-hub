import express, { Router } from 'express';
import { sanitize } from '../../lib/sanitize';
import { asyncWrapper } from '../asyncWrapper';
import { ArtistPage } from '../../models/ArtistPage';
import Debug from 'debug';
const debug = Debug('artisthub:publicapi');

export const publicApiRouter = express.Router();

const allowedFields: Array<keyof ArtistPage> = [
  'id',
  'title',
  'username',
  'headline',
  'description',
  'profileImageFilename',
];

/**
 * Get the public API routes
 *
 * @returns An Express Router
 */
export function getPublicApiRoutes(): Router {
  const router = express.Router();
  router.get('/:username', getArtistPage);
  return router;
}

// Get artist page
const getArtistPage = asyncWrapper(async (req, res) => {
  const artistPage = await ArtistPage.query()
    .findOne({
      username: req.params.username,
    })
    .select(allowedFields)
    .withGraphFetched({
      apActor: {
        deliveredObjects: {
          actor: true,
          attachments: true,
        },
      },
    })
    .modifyGraph('apActor', (builder) => {
      builder.select(['id', 'uri', 'url']);
    })
    .modifyGraph('apActor.deliveredObjects', (builder) => {
      builder.orderBy('id', 'desc').limit(20);
    })
    .modifyGraph('apActor.deliveredObjects.attachments', (builder) => {
      builder.select([
        'id',
        'url',
        'thumbnailUrl',
        'description',
        'mediaType',
        'blurhash',
      ]);
    });
  if (artistPage) {
    debug(artistPage.apActor);
    res.send({
      title: artistPage.title,
      username: artistPage.username,
      headline: artistPage.headline,
      description: artistPage.description,
      profileImage: artistPage.profileImageUrl(),
      url: artistPage.apActor.url || artistPage.apActor.uri,
      feed:
        artistPage.apActor.deliveredObjects?.map((o) => ({
          id: o.id,
          accountUrl: o.actor && (o.actor.url || o.actor.uri),
          username: o.actor?.username,
          name: o.actor?.username, // To-do store the AP name field
          domain: o.actor?.domain,
          url: o.url || o.uri,
          content: o.content && sanitize(o.content),
          attachments: o.attachments,
        })) || [],
    });
  } else {
    res.sendStatus(404);
  }
});
