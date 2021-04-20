import express from 'express';
import { inbox } from '../../activitypub/inbox';
import { asyncWrapper } from '../asyncWrapper';

export function getSharedInboxRoutes() {
  const router = express.Router();
  router.post('/sharedInbox', sharedInbox);
  return router;
}

const sharedInbox = asyncWrapper(async (req, res) => {
  console.log('Shared Inbox');
  await inbox(req.body);
  res.send(200);
});
