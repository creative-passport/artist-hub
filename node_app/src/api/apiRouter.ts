import express from 'express';
import { requireAuth } from '../auth/auth';
import { adminApiRouter } from './adminApi';
import { publicApiRouter } from './publicApi';

export const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use('/admin', requireAuth, adminApiRouter);
apiRouter.use(publicApiRouter);
