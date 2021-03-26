import { Request, Response } from 'express';
import { errorHandler } from './api/errorHandler';

export const asyncWrapper = (
  fn: (req: Request, res: Response) => Promise<void>
) => async (req: Request, res: Response) => {
  try {
    await fn(req, res);
  } catch (err) {
    return errorHandler(err, res);
  }
};
