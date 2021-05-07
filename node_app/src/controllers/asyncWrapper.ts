import { Request, Response } from 'express';
import { errorHandler } from './errorHandler';

/**
 * A wrapper to handle errors thrown in an Express handler
 *
 * @param fn - An async Express handler function
 * @returns - A wrapped Express handler function
 */
export const asyncWrapper = (
  fn: (req: Request, res: Response) => Promise<void>
) => async (req: Request, res: Response): Promise<void> => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    return errorHandler(err, res);
  }
};
