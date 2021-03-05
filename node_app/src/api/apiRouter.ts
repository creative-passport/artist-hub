import express, { Request, Response } from 'express';
import { requireAuth } from '../auth/auth';
import { User } from '../models/User';
import { errorHandler } from './errorHandler';
import bodyParser from 'body-parser';

export const apiRouter = express.Router();
apiRouter.use(requireAuth, bodyParser.json());

// Test API endpoint
apiRouter.get('/ping', (req, res) => {
  res.send({ success: true });
});

const asyncWrapper = (
  fn: (req: Request, res: Response) => Promise<void>
) => async (req: Request, res: Response) => {
  try {
    await fn(req, res);
  } catch (err) {
    return errorHandler(err, res);
  }
};

// Get artist pages
apiRouter.get(
  '/artistPages',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const artistPages = await user
      .$relatedQuery('artistPages')
      .orderBy('name')
      .allowNotFound();
    res.send(artistPages);
  })
);

// Get artist page
apiRouter.get(
  '/artistPages/:artistPageId',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const artistPage = await user
      .$relatedQuery('artistPages')
      .findById(req.params.artistPageId);
    if (artistPage) {
      res.send(artistPage);
    } else {
      res.sendStatus(404);
    }
  })
);

// Create new artist page
apiRouter.post(
  '/artistPages',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    console.log('new page', req.body);
    const artistPage = await user
      .$relatedQuery('artistPages')
      .insert({ name: req.body.name })
      .returning('*')
      .first();
    res.send(artistPage);
  })
);

// Update artist page
apiRouter.put(
  '/artistPages/:artistPageId',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    const artistPage = await user
      .$relatedQuery('artistPages')
      .patch({ name: req.body.name })
      .where('id', req.params.artistPageId)
      .returning('*')
      .first();
    res.send(artistPage);
  })
);

// Delete artist page
apiRouter.delete(
  '/artistPages/:artistPageId',
  asyncWrapper(async (req, res) => {
    const user = req.user as User;
    await user.$relatedQuery('artistPages').deleteById(req.params.artistPageId);
    res.sendStatus(204);
  })
);
