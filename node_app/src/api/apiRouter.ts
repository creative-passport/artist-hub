import express, { Request, Response } from 'express';
import { requireAuth } from '../auth/auth';
import { User } from '../models/User';
import { errorHandler } from './errorHandler';

export const apiRouter = express.Router();
apiRouter.use(requireAuth);

// Test API endpoint
apiRouter.get('/ping', (req, res) => {
  res.send({ success: true });
});

// Get artist pages
apiRouter.get('/artistPages', async (req, res) => {
  const user = req.user as User;
  const artistPages = await user.$relatedQuery('artistPages').orderBy('name');
  res.send(artistPages);
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
