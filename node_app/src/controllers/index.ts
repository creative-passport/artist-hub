import express, { Router } from 'express';
import { getWellKnownRoutes } from './wellKnown';
import { csrfProtection } from '../csrf';
import { getActivityPubRoutes } from './activitypub/router';
import { getApiRoutes } from './api/apiRouter';

export function getRoutes(): Router {
  const router = express.Router();

  router.use('/api', csrfProtection, getApiRoutes());
  router.use('/', getActivityPubRoutes());
  router.use('/.well-known', getWellKnownRoutes());
  return router;
}
