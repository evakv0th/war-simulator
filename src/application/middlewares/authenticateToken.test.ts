import { Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from './authenticateToken'; // Replace with your actual middleware path
import pool from '../db/db'; // Replace with your actual db path
import { sha256 } from '../../auth/auth.sha256'; // Replace with your actual auth.sha256 path

jest.mock('../db/db');
jest.mock('../../auth/auth.sha256');
describe('authenticateToken middleware', () => {
  let req: AuthenticatedRequest;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate with a valid token', async () => {
    const validToken = 'valid.token.signature';
    (req.header as any).mockReturnValue(validToken);
    (sha256 as jest.Mock).mockReturnValue('signature');

    jest.spyOn(JSON, 'parse').mockReturnValue({
      sub: 1,
    });

    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValue({
        rows: [
          { id: 1, name: 'admin', email: 'admin@gmail.com', type: 'admin' },
        ],
      }),
      release: jest.fn(),
    });

    await authenticateToken(req, res, next);

    //   expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({
      id: 1,
      name: 'admin',
      email: 'admin@gmail.com',
      type: 'admin',
    });
  });

  it('should reject with an invalid token', async () => {
    const invalidToken = 'invalid.token.signature';
    (req.header as any).mockReturnValue(`Bearer ${invalidToken}`);
    (sha256 as jest.Mock).mockReturnValue('valid.token.signature');
    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValue({
        rows: [
          { id: 1, name: 'admin', email: 'admin@gmail.com', type: 'admin' },
        ],
      }),
      release: jest.fn(),
    });

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized2');
    expect(next).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('should reject without a token', async () => {
    (req.header as any).mockReturnValue(undefined);

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized3');
    expect(next).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('should return user and next after testing jwt', async () => {
    const token = 'testing-code-secret-jwt';
    (req.header as any).mockReturnValue(`${token}`);

    await authenticateToken(req, res, next);

    expect(res.status).not.toHaveBeenCalledWith();
    expect(res.send).not.toHaveBeenCalledWith();
    expect(next).toHaveBeenCalled();
    expect((req.user as any).id).toEqual(1);
    expect((req.user as any).name).toEqual('admin');
  });
});
