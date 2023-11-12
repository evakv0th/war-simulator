import { Request, Response } from 'express';
import {
  getPlanes,
  getPlaneById,
  postPlane,
  updatePlane,
  deletePlane,
  assignPlaneToArmy,
  removePlaneFromArmy,
} from '../planes.controller';
import * as planesService from '../planes.service';
import HttpException from '../../application/exceptions/http-exceptions';
import { planesForTest } from '../types/plames.for-test.array';
import { ValidatedRequest } from 'express-joi-validation';
import HttpStatusCode from '../../application/exceptions/statusCode';
import { PlaneRequest } from '../types/planes.interfaces';

jest.mock('../planes.service');

describe('getPlanes', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return planes', async () => {
    (planesService.getPlanes as jest.Mock).mockResolvedValueOnce(planesForTest);

    await getPlanes(req, res);

    expect(res.json).toHaveBeenCalledWith(planesForTest);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.getPlanes as jest.Mock).mockRejectedValueOnce(mockError);

    await getPlanes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('getPlaneById', () => {
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

  it('should return plane by id successfully', async () => {
    (planesService.getPlaneById as jest.Mock).mockResolvedValueOnce(
      planesForTest[0],
    );

    await getPlaneById(req as any, res);

    expect(res.json).toHaveBeenCalledWith(planesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.getPlaneById as jest.Mock).mockRejectedValueOnce(mockError);

    await getPlaneById(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('postPlane', () => {
  let req: ValidatedRequest<PlaneRequest>;
  let res: Response;

  beforeEach(() => {
    req = {
      body: planesForTest[0],
    } as ValidatedRequest<PlaneRequest>;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should create and return plane successfully', async () => {
    (planesService.postPlane as jest.Mock).mockResolvedValueOnce(req.body);

    await postPlane(req, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.postPlane as jest.Mock).mockRejectedValueOnce(mockError);

    await postPlane(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('updatePlane', () => {
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

  it('should return plane after update', async () => {
    (planesService.updatePlane as jest.Mock).mockResolvedValueOnce(
      planesForTest[0],
    );

    await updatePlane(req as any, res);

    expect(res.json).toHaveBeenCalledWith(planesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.updatePlane as jest.Mock).mockRejectedValueOnce(mockError);

    await updatePlane(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('deletePlane', () => {
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

  it('should return plane after update', async () => {
    (planesService.deletePlane as jest.Mock).mockResolvedValueOnce(
      planesForTest[0],
    );

    await deletePlane(req as any, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
    expect(res.json).toHaveBeenCalledWith(planesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.deletePlane as jest.Mock).mockRejectedValueOnce(mockError);

    await deletePlane(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('assignPlaneToArmy', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { planeId: 1, armyId: 1 },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return plane after update', async () => {
    (planesService.assignPlaneToArmy as jest.Mock).mockResolvedValueOnce(
      planesForTest.find(
        (a) =>
          (a.id as any) === req.params.planeId &&
          (a.army_id as any) === req.params.armyId,
      ),
    );

    await assignPlaneToArmy(req as any, res);

    expect(res.json).toHaveBeenCalledWith(
      planesForTest.find(
        (a) =>
          (a.id as any) === req.params.planeId &&
          (a.army_id as any) === req.params.armyId,
      ),
    );
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.assignPlaneToArmy as jest.Mock).mockRejectedValueOnce(
      mockError,
    );

    await assignPlaneToArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('removePlaneFromArmy', () => {
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

  it('should return plane after update', async () => {
    (planesService.removePlaneFromArmy as jest.Mock).mockResolvedValueOnce(
      planesForTest[0],
    );

    await removePlaneFromArmy(req as any, res);

    expect(res.json).toHaveBeenCalledWith(planesForTest[0]);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (planesService.removePlaneFromArmy as jest.Mock).mockRejectedValueOnce(
      mockError,
    );

    await removePlaneFromArmy(req as any, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
