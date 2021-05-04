import express from 'express';
import { verifiedActorFromSignature } from '../../activitypub/verifySignature';
import { inbox } from '../../activitypub/inbox';
import { asyncWrapper } from '../asyncWrapper';
import { RequestWithRawBody } from '../../types';
import Debug from 'debug';
const debug = Debug('artisthub:sharedinbox');

export function getSharedInboxRoutes() {
  const router = express.Router();
  router.post('/sharedInbox', sharedInbox);
  return router;
}

const sharedInbox = asyncWrapper(async (req, res) => {
  debug('Shared Inbox');
  const verifiedActor = await verifiedActorFromSignature(
    req as RequestWithRawBody
  );

  await inbox(verifiedActor, req.body);
  res.send(200);
});
