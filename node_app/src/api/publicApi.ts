import express from 'express';
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
      .select(allowedFields);
    if (artistPage) {
      res.send(artistPage);
    } else {
      res.sendStatus(404);
    }
  })
);
