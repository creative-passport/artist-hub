import express, { Router, Request } from 'express';
import { getActorRoutes } from './actor';
import { getSharedInboxRoutes } from './sharedInbox';
import { RequestWithRawBody } from '../../types';

const activityPubMimeTypes = [
  'application/ld+json"',
  'application/activity+json',
];

export function getActivityPubRoutes(): Router {
  const router = express.Router();
  router.use(
    express.json({
      type: activityPubMimeTypes,
      verify: (req, res, buf, encoding) => {
        (req as RequestWithRawBody).rawBody = buf;
      },
    })
  );

  router.use('/p/:username', getActorRoutes());
  router.use('/', getSharedInboxRoutes());
  return router;
}
