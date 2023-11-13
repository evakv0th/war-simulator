import { Response, NextFunction } from 'express';
import { User } from '../../auth/types/auth.interfaces';
import { AuthenticatedRequest } from './authenticateToken';

export function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user: User | undefined = req.user;
  if (!user) {
    res.status(401).send("dumb bunny no user here");
  }
  if (user && user.type === 'admin') {
    next();
  } else {
    res.status(403).send("You are not an admin, you cannot do this");
  }
}