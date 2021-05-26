import express, { Router } from 'express';
import { getWellKnownRoutes } from './wellKnown';
import { csrfProtection } from '../csrf';
import { getActivityPubRoutes } from './activitypub/router';
import { getApiRoutes } from './api/apiRouter';

/**
 * Get the top level application routes
 *
 * @returns An Express Router
 */
export function getRoutes(): Router {
  const router = express.Router();

  router.use('/files', express.static('files'));
  router.use('/api', csrfProtection, getApiRoutes());
  router.use('/', getActivityPubRoutes());
  router.use('/.well-known', getWellKnownRoutes());
  return router;
}
