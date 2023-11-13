import { Response, NextFunction } from 'express';
import { isAdmin } from './isAdmin';
import { AuthenticatedRequest } from './authenticateToken'; 
import { User } from '../../auth/types/auth.interfaces';


jest.mock('./authenticateToken');

describe('isAdmin middleware', () => {
  let req: AuthenticatedRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: undefined,
    } as AuthenticatedRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    next = jest.fn();
  });

  it('should allow access for admin', () => {
    const adminUser = { type: 'admin' } as User;
    req.user = adminUser;

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should deny acces for regular user', () => {
    const nonAdminUser = { type: 'user' } as User;
    req.user = nonAdminUser;

    isAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('You are not an admin, you cannot do this');
  });

});