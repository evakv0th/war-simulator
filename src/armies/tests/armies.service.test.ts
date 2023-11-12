import {
  getArmies,
  getArmyById,
  postArmy,
  updateArmy,
  deleteArmy,
  assignArmyToUser,
} from '../armies.service';
import { pool } from '../../application/db/db';
import HttpException from '../../application/exceptions/http-exceptions';
import {
  Army,
  ArmiesCreateSchema,
  ArmyAdvantage,
} from '../types/armies.interfaces';
import { armiesForTest } from '../types/armies.for-test.array';
import { usersForTest } from '../../auth/types/auth.for-test.array';

jest.mock('../../application/db/db');

describe('getArmies', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Armies from the database', async () => {
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest,
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const armys = await getArmies();

    expect(armys).toHaveLength(2);
    expect(armys[1].name).toBe('army2');

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
      await getArmies();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('getArmyById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return army by id', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const army = await getArmyById(id as any);

    expect(army).toBeTruthy();
    expect(army.id).toBe(id);
    expect(army.name).toBe('army1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or Army does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await getArmyById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`army with id:${id} not found`);
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
      await getArmyById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('postArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if army already here', async () => {
    const newArmy: ArmiesCreateSchema = {
      name: armiesForTest[0].name,
      advantage: ArmyAdvantage.AIR,
      fuel_amount: 100,
      bullets_amount: 100,
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.name === newArmy.name),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await postArmy(newArmy);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `Army with that name ${armiesForTest[0].name} already registered`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error 500 if Army creation failed', async () => {
    const newArmy: ArmiesCreateSchema = {
      name: armiesForTest[0].name,
      advantage: ArmyAdvantage.AIR,
      fuel_amount: 100,
      bullets_amount: 100,
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
      await postArmy(newArmy);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(500);
      expect((error as any).message).toBe(`Army creation failed`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return Army after creation', async () => {
    const newArmy: ArmiesCreateSchema = {
      name: '12312321321123123',
      advantage: ArmyAdvantage.AIR,
      fuel_amount: 100,
      bullets_amount: 100,
    };
    const queryMock = jest.fn();
    queryMock
      .mockImplementationOnce(() => {
        return { rows: [] };
      })
      .mockImplementationOnce(() => {
        return { rows: [newArmy] };
      });
    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Army = await postArmy(newArmy);

    expect(Army).toEqual(newArmy);

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
      await postArmy({ name: 'jeff1' } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('updateArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or Army does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateArmy(id as any, { name: 'jeff1' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`army not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong no valid field for update', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateArmy(id as any, { nam: 'jeff' } as any);
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

  it('should return updated Army', async () => {
    const id = 1;
    const updatedInfo = {
      name: 'jeff',
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const army = await updateArmy(id as any, updatedInfo);

    expect(army).toEqual(armiesForTest[0]);

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
      await updateArmy(id as any, '21312' as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('deleteArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return army after deleting (therefore its still will be no content in controller)', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Army = await deleteArmy(id as any);

    expect(Army).toBeTruthy();
    expect(Army.id).toBe(id);
    expect(Army.name).toBe('army1');

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
      await deleteArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('assignArmyToUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or Army does not exist', async () => {
    const id = 99;
    const userId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.filter((a) => a.id === userId),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await assignArmyToUser(id as any, userId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`Army with id:${id} not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });
  it('should throw error if wrong id or user does not exist', async () => {
    const id = 1;
    const userId = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await assignArmyToUser(id as any, userId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`user with id:${userId} not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return Army after assigning', async () => {
    const id = 1;
    const armyId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: armiesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Army = await assignArmyToUser(id as any, armyId as any);

    expect(Army).toEqual(armiesForTest[0]);

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
      await assignArmyToUser(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});
