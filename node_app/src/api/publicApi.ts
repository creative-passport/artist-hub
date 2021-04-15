import express from 'express';
import { sanitize } from '../lib/sanitize';
import { asyncWrapper } from '../asyncWrapper';
import { ArtistPage } from '../models/ArtistPage';

export const publicApiRouter = express.Router();

const allowedFields: Array<keyof ArtistPage> = ['title', 'username'];

// Get artist page
publicApiRouter.get(
  '/artistpages/:username',
  asyncWrapper(async (req, res) => {
    const artistPage = await ArtistPage.query()
      .findOne({
        username: req.params.username,
      })
      .select(allowedFields)
      .withGraphFetched({
        apActor: {
          deliveredObjects: {
            actor: true,
          },
        },
      })
      .modifyGraph('apActor', builder => {
        builder.select(['id']);
      });
    if (artistPage) {
      res.send({
        title: artistPage.title,
        username: artistPage.username,
        feed: artistPage.apActor.deliveredObjects?.map(o => ({
          id: o.id,
          accountUrl: o.actor?.uri,
          username: o.actor?.username,
          domain: o.actor?.domain,
          url: o.url || o.uri,
          content: o.content && sanitize(o.content)
        })) || []
      });
    } else {
      res.sendStatus(404);
    }
  })
);
