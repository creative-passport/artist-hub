import express, { Router } from 'express';
import { getActorRoutes } from './actor';
import { getSharedInboxRoutes } from './sharedInbox';
import { RequestWithRawBody } from '../../types';

const activityPubMimeTypes = [
  'application/ld+json"',
  'application/activity+json',
];

/**
 * Get the ActivityPub routes
 *
 * @returns An Express Router
 */
export function getActivityPubRoutes(): Router {
  const router = express.Router();
  router.use(
    express.json({
      type: activityPubMimeTypes,
      verify: (req, _res, buf, _encoding) => {
        (req as RequestWithRawBody).rawBody = buf;
      },
    })
  );

  router.use('/p/:username', getActorRoutes());
  router.use('/', getSharedInboxRoutes());
  return router;
}
