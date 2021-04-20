import express from 'express';
import { getAdminApiRoutes } from './adminApi';
import { getPublicApiRoutes } from './publicApi';

export function getApiRoutes() {
  const router = express.Router();
  router.use(express.json());
  router.use('/admin', getAdminApiRoutes());
  router.use('/artistpages', getPublicApiRoutes());
  return router;
}
