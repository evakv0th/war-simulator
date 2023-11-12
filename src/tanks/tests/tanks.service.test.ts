import {
  getTankById,
  getTanks,
  postTank,
  updateTank,
  deleteTank,
  assignTankToArmy,
  removeTankFromArmy,
} from '../tanks.service';
import { pool } from '../../application/db/db';
import { tanksForTest } from '../types/tanks.for-test.array';
import HttpException from '../../application/exceptions/http-exceptions';
import { TanksCreateSchema } from '../types/tanks.interfaces';
import { armiesForTest } from '../../armies/types/armies.for-test.array';

jest.mock('../../application/db/db');

describe('getTanks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return tanks from the database', async () => {
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest,
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tanks = await getTanks();

    expect(tanks).toHaveLength(2);
    expect(tanks[1].name).toBe('tank2');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await getTanks();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('getTankById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return tank by id', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tank = await getTankById(id as any);

    expect(tank).toBeTruthy();
    expect(tank.id).toBe(id);
    expect(tank.name).toBe('tank1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or tank does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await getTankById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`tank with id:${id} not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    const id = 1;

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await getTankById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('postTank', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if tank already here', async () => {
    const newTank: TanksCreateSchema = {
      name: tanksForTest[0].name,
      strength: 100,
      fuel_req: 100,
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.name === newTank.name),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await postTank(newTank);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `Tank with that name ${tanksForTest[0].name} already registered`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error 500 if tank creation failed', async () => {
    const newTank: TanksCreateSchema = {
      name: tanksForTest[0].name,
      strength: 100,
      fuel_req: 100,
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: [],
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await postTank(newTank);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(500);
      expect((error as any).message).toBe(`Tank creation failed`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return tank after creation', async () => {
    const newTank: TanksCreateSchema = {
      name: '12312312321312312123123123231123123123123123123123123',
      strength: 100,
      fuel_req: 100,
    };
    const queryMock = jest.fn();
    queryMock
      .mockImplementationOnce(() => {
        return { rows: [] };
      })
      .mockImplementationOnce(() => {
        return { rows: [newTank] };
      });
    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tank = await postTank(newTank);

    expect(tank).toEqual(newTank);

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });
  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    const id = 1;

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await postTank(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('updateTank', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or tank does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateTank(id as any, { name: 'jeff1' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`tank not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong no valid field for update', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateTank(id as any, { nam: 'jeff' } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `No valid fields provided for update`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return updated tank', async () => {
    const id = 1;
    const updatedInfo = {
      name: 'jeff',
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => (a.id === id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tank = await updateTank(id as any, updatedInfo);

    expect(tank).toEqual(tanksForTest[0]);

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    const id = 1;

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await updateTank(id as any, '21312' as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});


describe('deleteTank', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return tank after deleting (therefore its still will be no content in controller)', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tank = await deleteTank(id as any);

    expect(tank).toBeTruthy();
    expect(tank.id).toBe(id);
    expect(tank.name).toBe('tank1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    const id = 1;

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await deleteTank(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('assignTankToArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or tank does not exist', async () => {
    const id = 99;
    const armyId = 1
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await assignTankToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`tank with id:${id} not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });
  it('should throw error if wrong id or army does not exist', async () => {
    const id = 1;
    const armyId = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await assignTankToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`Army not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return tank after assigning', async () => {
    const id = 1;
    const armyId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tank = await assignTankToArmy(id as any, armyId as any)

    expect(tank).toEqual(tanksForTest[0]);

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });


  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    const id = 1;
    const armyId = 1;

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await assignTankToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});


describe('removeTankFromArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return tank after removing from army', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tank = await removeTankFromArmy(id as any);

    expect(tank).toBeTruthy();
    expect(tank.id).toBe(id);
    expect(tank.name).toBe('tank1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or tank does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: tanksForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await removeTankFromArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`tank with id:${id} not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should handle database error', async () => {
    const releaseMock = jest.fn();

    const id = 1;

    (pool.connect as jest.Mock).mockRejectedValue(
      new Error('Connection error'),
    );

    try {
      await removeTankFromArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});