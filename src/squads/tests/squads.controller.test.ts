import { Request, Response } from 'express';
import {
  getSquads,
  getSquadById,
  postSquad,
  updateSquad,
  deleteSquad,
  assignSquadToArmy,
  removeSquadFromArmy,
} from '../squads.controller';
import * as squadsService from '../squads.service';
import HttpException from '../../application/exceptions/http-exceptions';
import { squadsForTest } from '../types/squads.for-test.array';
import { ValidatedRequest } from 'express-joi-validation';
import { TankRequest } from '../../tanks/types/tanks.interfaces';
import HttpStatusCode from '../../application/exceptions/statusCode';
import { SquadRequest } from '../types/squads.interfaces';

jest.mock('../squads.service');

describe('getSquads', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return Squads', async () => {
    (squadsService.getSquads as jest.Mock).mockResolvedValueOnce(squadsForTest);

    await getSquads(req, res);

    expect(res.json).toHaveBeenCalledWith(squadsForTest);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.getSquads as jest.Mock).mockRejectedValueOnce(mockError);

    await getSquads(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('getSquadById', () => {
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

  it('should return Squad by id successfully', async () => {
    (squadsService.getSquadById as jest.Mock).mockResolvedValueOnce(
      squadsForTest[0],
    );

    await getSquadById(req as any, res);

    expect(res.json).toHaveBeenCalledWith(squadsForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.getSquadById as jest.Mock).mockRejectedValueOnce(mockError);

    await getSquadById(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('postSquad', () => {
  let req: ValidatedRequest<SquadRequest>;
  let res: Response;

  beforeEach(() => {
    req = {
      body: squadsForTest[0],
    } as ValidatedRequest<SquadRequest>;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should create and return Squad successfully', async () => {
    (squadsService.postSquad as jest.Mock).mockResolvedValueOnce(req.body);

    await postSquad(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.postSquad as jest.Mock).mockRejectedValueOnce(mockError);

    await postSquad(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('updateSquad', () => {
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

  it('should return Squad after update', async () => {
    (squadsService.updateSquad as jest.Mock).mockResolvedValueOnce(
      squadsForTest[0],
    );

    await updateSquad(req as any, res);

    expect(res.json).toHaveBeenCalledWith(squadsForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.updateSquad as jest.Mock).mockRejectedValueOnce(mockError);

    await updateSquad(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('deleteSquad', () => {
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

  it('should return Squad after update', async () => {
    (squadsService.deleteSquad as jest.Mock).mockResolvedValueOnce(
      squadsForTest[0],
    );

    await deleteSquad(req as any, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
    expect(res.json).toHaveBeenCalledWith(squadsForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.deleteSquad as jest.Mock).mockRejectedValueOnce(mockError);

    await deleteSquad(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('assignSquadToArmy', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { SquadId: 1, armyId: 1 },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return Squad after update', async () => {
    (squadsService.assignSquadToArmy as jest.Mock).mockResolvedValueOnce(
      squadsForTest.find(
        (a) =>
          (a.id as any) === req.params.SquadId &&
          (a.army_id as any) === req.params.armyId,
      ),
    );

    await assignSquadToArmy(req as any, res);

    expect(res.json).toHaveBeenCalledWith(
      squadsForTest.find(
        (a) =>
          (a.id as any) === req.params.SquadId &&
          (a.army_id as any) === req.params.armyId,
      ),
    );
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.assignSquadToArmy as jest.Mock).mockRejectedValueOnce(
      mockError,
    );

    await assignSquadToArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('removeSquadFromArmy', () => {
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
    (squadsService.removeSquadFromArmy as jest.Mock).mockResolvedValueOnce(
      squadsForTest[0],
    );

    await removeSquadFromArmy(req as any, res);

    expect(res.json).toHaveBeenCalledWith(squadsForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (squadsService.removeSquadFromArmy as jest.Mock).mockRejectedValueOnce(
      mockError,
    );

    await removeSquadFromArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
