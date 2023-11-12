import { Request, Response } from 'express';
import { getTankById, getTanks, postTank, updateTank, deleteTank, assignTankToArmy, removeTankFromArmy } from '../tanks.controller';
import * as tanksService from '../tanks.service';
import HttpException from '../../application/exceptions/http-exceptions';
import { tanksForTest } from '../types/tanks.for-test.array';
import { ValidatedRequest } from 'express-joi-validation';
import { TankRequest } from '../types/tanks.interfaces';
import HttpStatusCode from '../../application/exceptions/statusCode';

jest.mock('../tanks.service.ts');

describe('getTanks', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as any;
  });

  it('should return tanks', async () => {
    (tanksService.getTanks as jest.Mock).mockResolvedValueOnce(tanksForTest);

    await getTanks(req, res);

    expect(res.json).toHaveBeenCalledWith(tanksForTest);
  });

  it('should handle error 500', async () => {
    const mockError = new Error('Internal Server Error');
    (tanksService.getTanks as jest.Mock).mockRejectedValueOnce(mockError);

    await getTanks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});


describe('getTankById', () => {
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
  
    it('should return tank by id successfully', async () => {
      (tanksService.getTankById as jest.Mock).mockResolvedValueOnce(tanksForTest[0]);
  
      await getTankById(req as any, res);
  
      expect(res.json).toHaveBeenCalledWith(tanksForTest[0]);
    });
   
    it('should handle error 500', async () => {
      const mockError = new Error('Internal Server Error');
      (tanksService.getTankById as jest.Mock).mockRejectedValueOnce(mockError);
  
      await getTankById(req as any, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });


  describe('postTank', () => {
    let req: ValidatedRequest<TankRequest>;
    let res: Response;
  
    beforeEach(() => {
      req = {
        body: tanksForTest[0],
      } as ValidatedRequest<TankRequest>;
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;
    });
  
    it('should create and return tank successfully', async () => {
      (tanksService.postTank as jest.Mock).mockResolvedValueOnce(req.body);
  
      await postTank(req, res);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  
    it('should handle error 500', async () => {
      const mockError = new Error('Internal Server Error');
      (tanksService.postTank as jest.Mock).mockRejectedValueOnce(mockError);
  
      await postTank(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateTank', () => {
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
      (tanksService.updateTank as jest.Mock).mockResolvedValueOnce(tanksForTest[0]);
  
      await updateTank(req as any, res);
  
      expect(res.json).toHaveBeenCalledWith(tanksForTest[0]);
    });
   
    it('should handle error 500', async () => {
      const mockError = new Error('Internal Server Error');
      (tanksService.updateTank as jest.Mock).mockRejectedValueOnce(mockError);
  
      await updateTank(req as any, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });


  describe('deleteTank', () => {
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
      (tanksService.deleteTank as jest.Mock).mockResolvedValueOnce(tanksForTest[0]);
  
      await deleteTank(req as any, res);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(res.json).toHaveBeenCalledWith(tanksForTest[0]);
    });
   
    it('should handle error 500', async () => {
      const mockError = new Error('Internal Server Error');
      (tanksService.deleteTank as jest.Mock).mockRejectedValueOnce(mockError);
  
      await deleteTank(req as any, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  

  
  describe('assignTankToArmy', () => {
    let req: Request;
    let res: Response;
  
    beforeEach(() => {
      req = {
        params: {tankId: 1, armyId: 1 },
      } as any;
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as any;
    });
  
    it('should return tank after update', async () => {
      (tanksService.assignTankToArmy as jest.Mock).mockResolvedValueOnce(tanksForTest.find((a) => a.id as any === req.params.tankId && a.army_id as any === req.params.armyId));
  
      await assignTankToArmy(req as any, res);
  
      expect(res.json).toHaveBeenCalledWith(tanksForTest.find((a) => a.id as any === req.params.tankId && a.army_id as any === req.params.armyId));
    });
   
    it('should handle error 500', async () => {
      const mockError = new Error('Internal Server Error');
      (tanksService.assignTankToArmy as jest.Mock).mockRejectedValueOnce(mockError);
  
      await assignTankToArmy(req as any, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  
  describe('removeTankFromArmy', () => {
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
      (tanksService.removeTankFromArmy as jest.Mock).mockResolvedValueOnce(tanksForTest[0]);
  
      await removeTankFromArmy(req as any, res);
  
      expect(res.json).toHaveBeenCalledWith(tanksForTest[0]);
    });
   
    it('should handle error 500', async () => {
      const mockError = new Error('Internal Server Error');
      (tanksService.removeTankFromArmy as jest.Mock).mockRejectedValueOnce(mockError);
  
      await removeTankFromArmy(req as any, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  

  
