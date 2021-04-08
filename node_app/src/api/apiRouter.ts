import express from 'express';
import { requireAuth } from '../auth/auth';
import { adminApiRouter } from './adminApi';
import { publicApiRouter } from './publicApi';

// SPDX-FileCopyrightText:  2021 Creative Passport MTÜ
// SPDX-License-Identifier: AGPL-3.0-or-later

export const apiRouter = express.Router();
apiRouter.use(express.json());

apiRouter.use('/admin', requireAuth, adminApiRouter);
apiRouter.use(publicApiRouter);
