import { Request, Response } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  battle,
  airBattle,
  surfaceBattle,
  AuthenticatedRequest,
} from '../users.controller';
import * as usersService from '../users.service';
import HttpException from '../../application/exceptions/http-exceptions';
import { usersForTest } from '../../auth/types/auth.for-test.array';
import { ValidatedRequest } from 'express-joi-validation';
import { UserRequest } from '../../auth/types/user-login-schema';
import HttpStatusCode from '../../application/exceptions/statusCode';

jest.mock('../users.service');

describe('getUsers', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return users', async () => {
    (usersService.getUsers as jest.Mock).mockResolvedValueOnce(usersForTest);

    req.query = { name: 'jeff1' };
    await getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(usersForTest);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.getUsers as jest.Mock).mockRejectedValueOnce(mockError);

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('getUserById', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: '1' },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return user by id successfully', async () => {
    (usersService.getUserById as jest.Mock).mockResolvedValueOnce(
      usersForTest[0],
    );

    await getUserById(req as any, res);

    expect(res.json).toHaveBeenCalledWith(usersForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.getUserById as jest.Mock).mockRejectedValueOnce(mockError);

    await getUserById(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('updateUser', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: '1' },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return user after update', async () => {
    (usersService.updateUser as jest.Mock).mockResolvedValueOnce(
      usersForTest[0],
    );

    await updateUser(req as any, res);

    expect(res.json).toHaveBeenCalledWith(usersForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.updateUser as jest.Mock).mockRejectedValueOnce(mockError);

    await updateUser(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('deleteUser', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: '1' },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return tank after update', async () => {
    (usersService.deleteUser as jest.Mock).mockResolvedValueOnce(
      usersForTest[0],
    );

    await deleteUser(req as any, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
    expect(res.json).toHaveBeenCalledWith(usersForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.deleteUser as jest.Mock).mockRejectedValueOnce(mockError);

    await deleteUser(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('battle', () => {
  let req: AuthenticatedRequest<{ id: string }>;
  let res: Response;

  beforeEach(() => {
    req = {
      user: { id: '1' },
      params: { enemyId: '2' },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return match result', async () => {
    const mockMatchResult = { msg: 'battle staterd' };
    (usersService.battle as jest.Mock).mockResolvedValueOnce(mockMatchResult);

    await battle(req, res);

    expect(res.json).toHaveBeenCalledWith(mockMatchResult);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.battle as jest.Mock).mockRejectedValueOnce(mockError);

    await battle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('airBattle', () => {
  let req: AuthenticatedRequest<{ id: string }>;
  let res: Response;

  beforeEach(() => {
    req = {
      user: { id: '1' },
      params: { enemyId: '2' },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return match result', async () => {
    const mockMatchResult = { msg: 'air battle success' };
    (usersService.airBattle as jest.Mock).mockResolvedValueOnce(
      mockMatchResult,
    );

    await airBattle(req, res);

    expect(res.json).toHaveBeenCalledWith(mockMatchResult);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.airBattle as jest.Mock).mockRejectedValueOnce(mockError);

    await airBattle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('surfaceBattle', () => {
  let req: AuthenticatedRequest<{ id: string }>;
  let res: Response;

  beforeEach(() => {
    req = {
      user: { id: '1' },
      params: { enemyId: '2' },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return match result', async () => {
    const mockMatchResult = { msg: 'you lost even in tests...' };
    (usersService.surfaceBattle as jest.Mock).mockResolvedValueOnce(
      mockMatchResult,
    );

    await surfaceBattle(req, res);

    expect(res.json).toHaveBeenCalledWith(mockMatchResult);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (usersService.surfaceBattle as jest.Mock).mockRejectedValueOnce(mockError);

    await surfaceBattle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
