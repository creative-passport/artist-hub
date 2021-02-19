import express, { Request, Response } from 'express';

const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).end();
  }
  next();
};

export const apiRouter = express.Router();
apiRouter.use(requireAuth);

// Test API endpoint
apiRouter.get('/ping', (req, res) => {
  res.send({ success: true });
});
