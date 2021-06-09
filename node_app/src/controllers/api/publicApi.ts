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
  'coverImageFilename',
];

/**
 * Get the public API routes
 *
 * @returns An Express Router
 */
export function getPublicApiRoutes(): Router {
  const router = express.Router();
  router.get('/:username', getArtistPage);
  router.get('/:username/feed', getArtistFeed);
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
      apActor: true,
      links: true,
    })
    .modifyGraph('apActor', (builder) => {
      builder.select(['id', 'uri', 'url']);
    })
    .modifyGraph('links', (builder) => {
      builder.select(['id', 'sort', 'url']).orderBy('sort');
    });
  if (artistPage) {
    debug(artistPage.apActor);
    res.send({
      title: artistPage.title,
      username: artistPage.username,
      headline: artistPage.headline,
      description: artistPage.description,
      profileImage: artistPage.profileImageUrl(),
      coverImage: artistPage.coverImageUrl(),
      url: artistPage.apActor.url || artistPage.apActor.uri,
      links: artistPage.links?.map((l) => ({
        id: l.id,
        sort: l.sort,
        url: l.url,
      })),
    });
  } else {
    res.sendStatus(404);
  }
});

// Get artist page
const getArtistFeed = asyncWrapper(async (req, res) => {
  const pageSize = 20;
  const cursor = req.query.cursor;
  const artistPage = await ArtistPage.query()
    .findOne({
      username: req.params.username,
    })
    .select('id')
    .withGraphFetched({
      apActor: {
        deliveredObjects: {
          actor: true,
          attachments: true,
        },
      },
    })
    .modifyGraph('apActor', (builder) => {
      builder.select(['id']);
    })
    .modifyGraph('apActor.deliveredObjects', (builder) => {
      if (cursor) {
        builder.where('id', '<=', cursor);
      }
      builder.orderBy('id', 'desc').limit(pageSize + 1);
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
    debug(artistPage.apActor.deliveredObjects);
    const hasNext =
      artistPage.apActor.deliveredObjects != null &&
      artistPage.apActor.deliveredObjects.length > pageSize;
    const nextCursor = hasNext
      ? artistPage.apActor.deliveredObjects?.[pageSize].id
      : undefined;
    res.send({
      nextCursor: nextCursor,
      data:
        artistPage.apActor.deliveredObjects?.slice(0, pageSize).map((o) => ({
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
