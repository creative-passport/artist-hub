import express, { Request, Response } from 'express';
import { requireAuth } from '../auth/auth';

export const apiRouter = express.Router();
apiRouter.use(requireAuth);

// Test API endpoint
apiRouter.get('/ping', (req, res) => {
  res.send({ success: true });
});
