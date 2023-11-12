import { Request, Response } from 'express';
import {
  getArmies,
  getArmyById,
  postArmy,
  updateArmy,
  deleteArmy,
  assignArmyToUser,
} from './armies.controller';
import * as armiesService from './armies.service';
import HttpException from '../application/exceptions/http-exceptions';
import { armiesForTest } from './types/armies.for-test.array';
import { ValidatedRequest } from 'express-joi-validation';
import { TankRequest } from '../tanks/types/tanks.interfaces';
import HttpStatusCode from '../application/exceptions/statusCode';
import { ArmyRequest } from './types/armies.interfaces';

jest.mock('./armies.service');

describe('getArmies', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return armies', async () => {
    (armiesService.getArmies as jest.Mock).mockResolvedValueOnce(armiesForTest);

    await getArmies(req, res);

    expect(res.json).toHaveBeenCalledWith(armiesForTest);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (armiesService.getArmies as jest.Mock).mockRejectedValueOnce(mockError);

    await getArmies(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('getArmyById', () => {
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

  it('should return Army by id successfully', async () => {
    (armiesService.getArmyById as jest.Mock).mockResolvedValueOnce(
      armiesForTest[0],
    );

    await getArmyById(req as any, res);

    expect(res.json).toHaveBeenCalledWith(armiesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (armiesService.getArmyById as jest.Mock).mockRejectedValueOnce(mockError);

    await getArmyById(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('postArmy', () => {
  let req: ValidatedRequest<ArmyRequest>;
  let res: Response;

  beforeEach(() => {
    req = {
      body: armiesForTest[0],
    } as ValidatedRequest<ArmyRequest>;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should create and return Army successfully', async () => {
    (armiesService.postArmy as jest.Mock).mockResolvedValueOnce(req.body);

    await postArmy(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (armiesService.postArmy as jest.Mock).mockRejectedValueOnce(mockError);

    await postArmy(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('updateArmy', () => {
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

  it('should return Army after update', async () => {
    (armiesService.updateArmy as jest.Mock).mockResolvedValueOnce(
      armiesForTest[0],
    );

    await updateArmy(req as any, res);

    expect(res.json).toHaveBeenCalledWith(armiesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (armiesService.updateArmy as jest.Mock).mockRejectedValueOnce(mockError);

    await updateArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('deleteArmy', () => {
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

  it('should return Army after update', async () => {
    (armiesService.deleteArmy as jest.Mock).mockResolvedValueOnce(
      armiesForTest[0],
    );

    await deleteArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
    expect(res.json).toHaveBeenCalledWith(armiesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (armiesService.deleteArmy as jest.Mock).mockRejectedValueOnce(mockError);

    await deleteArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('assignArmyToUser', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { armyId: 1, userId: 1 },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return Army after update', async () => {
    (armiesService.assignArmyToUser as jest.Mock).mockResolvedValueOnce(
      armiesForTest.find(
        (a) =>
          (a.id as any) === req.params.ArmyId &&
          (a.user_id as any) === req.params.armyId,
      ),
    );

    await assignArmyToUser(req as any, res);

    expect(res.json).toHaveBeenCalledWith(
      armiesForTest.find(
        (a) =>
          (a.id as any) === req.params.ArmyId &&
          (a.user_id as any) === req.params.armyId,
      ),
    );
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (armiesService.assignArmyToUser as jest.Mock).mockRejectedValueOnce(
      mockError,
    );

    await assignArmyToUser(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
