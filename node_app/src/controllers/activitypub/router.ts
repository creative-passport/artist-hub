import express, { Router } from 'express';
import { getActorRoutes } from './actor';
import { getSharedInboxRoutes } from './sharedInbox';

const activityPubMimeTypes = [
  'application/ld+json"',
  'application/activity+json',
];

export function getActivityPubRoutes(): Router {
  const router = express.Router();
  router.use(
    express.json({
      type: activityPubMimeTypes,
    })
  );

  router.use('/p/:username', getActorRoutes());
  router.use('/', getSharedInboxRoutes());
  return router;
}
