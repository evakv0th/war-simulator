import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  battle,
  airBattle,
  surfaceBattle,
} from './users.service';
import { pool } from '../application/db/db';
import { usersForTest } from '../auth/types/auth.for-test.array';
import HttpException from '../application/exceptions/http-exceptions';
import { BattleState } from '../application/utils/battle-state';

jest.mock('../application/db/db');
jest.mock('../application/utils/battle-state');

describe('getUsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users from the database', async () => {
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest,
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const tanks = await getUsers('name');

    expect(tanks).toHaveLength(2);
    expect(tanks[1].name).toBe('user2');

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
      await getUsers('name');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('getUserById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user by id', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const user = await getUserById(id as any);

    expect(user).toBeTruthy();
    expect(user.id).toBe(id);
    expect(user.name).toBe('user1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or user does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await getUserById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`user with id:${id} not found`);
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
      await getUserById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('updateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or user does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateUser(id as any, { name: 'jeff1' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`user not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong no valid field for update', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateUser(id as any, { nam: 'jeff' } as any);
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

  it('should return updated user', async () => {
    const id = 1;
    const updatedInfo = {
      name: 'jeff',
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const user = await updateUser(id as any, updatedInfo);

    expect(user).toEqual(usersForTest[0]);

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
      await updateUser(id as any, '21312' as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('deleteUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user after deleting (therefore its still will be no content in controller)', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: usersForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const user = await deleteUser(id as any);

    expect(user).toBeTruthy();
    expect(user.id).toBe(id);
    expect(user.name).toBe('user1');

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
      await deleteUser(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('battle', () => {
  let mockShowStats: jest.Mock;

  beforeEach(() => {
    mockShowStats = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if last battle was not finished', async () => {
    const id = 1;
    const enemyId = 2;
    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'testing must fail here!',
    );

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await battle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `please finish your last battle before starting new one`,
      );
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('should throw error if you are fighting yourself', async () => {
    const id = 1;
    const enemyId = 1;

    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'not_started',
    );

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await battle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(`You cannot fight yourself`);
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('should throw error if you don`t have army', async () => {
    const id = 1;
    const enemyId = 2;

    const queryMock = jest.fn().mockResolvedValue({
      rows: [1],
    });

    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'not_started',
    );

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });
    const mockBattleStats = {
      yourStats: {
        yourPlanesAirStrength: 0,
        yourTanksStrength: 0,
        yourSquadsStrength: 0,
        yourPlanesSurfaceStrength: 0,
        yourAdvantage: 'air',
      },
      enemyStats: {
        enemyPlanesAirStrength: 100,
        enemyTanksStrength: 100,
        enemySquadsStrength: 100,
        enemyPlanesSurfaceStrength: 100,
        enemyAdvantage: 'air',
      },
    };
    mockShowStats.mockReturnValue(mockBattleStats);

    try {
      await battle(id as any, enemyId as any);
    } catch (error) {
      console.log(error);
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `You cant start battle, you should have at least 1 squad(with weapons!!), 1 tank and 1 plane`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });
});

describe('airBattle', () => {
  let mockShowStats: jest.Mock;

  beforeEach(() => {
    mockShowStats = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if you didnt start battle beforehand', async () => {
    const id = 1;
    const enemyId = 2;
    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'testing must fail here!',
    );

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await airBattle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(`please start battle first`);
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('should throw error if wrong enemy', async () => {
    const id = 1;
    const enemyId = 2;

    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'in_progress',
    );
    (BattleState.prototype.getEnemyId as jest.Mock).mockReturnValue(1);

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await airBattle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `wrong id of an enemy, you've started battle with user id:1`,
      );
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('should throw error if you are fighting yourself', async () => {
    const id = 1;
    const enemyId = 1;

    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'in_progress',
    );

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await airBattle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(`You cannot fight yourself`);
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
  it('should log draw', async () => {
    const id = 1;
    const enemyId = 2;

    const queryMock = jest.fn().mockResolvedValue({
      rows: [1],
    });

    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'in_progress',
    );
    (BattleState.prototype.getEnemyId as jest.Mock).mockReturnValue(2);

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const result = await airBattle(id as any, enemyId as any);

    expect(result.msg).toBe(
      `The air battle ended in a draw! Continue battle with /battle/${enemyId}/surfaceBattle`,
    );

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });
});

describe('surfaceBattle', () => {
  let mockShowStats: jest.Mock;

  beforeEach(() => {
    mockShowStats = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if you didnt start battle beforehand', async () => {
    const id = 1;
    const enemyId = 2;
    (BattleState.prototype.getState as jest.Mock).mockReturnValue(
      'testing must fail here!',
    );

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await surfaceBattle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(`please make air battle first`);
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('should throw error if wrong enemy', async () => {
    const id = 1;
    const enemyId = 2;

    (BattleState.prototype.getState as jest.Mock).mockReturnValue('air_draw');
    (BattleState.prototype.getEnemyId as jest.Mock).mockReturnValue(1);

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await surfaceBattle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `wrong id of an enemy, you've started battle with user id:1`,
      );
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });

  it('should throw error if you are fighting yourself', async () => {
    const id = 1;
    const enemyId = 1;

    (BattleState.prototype.getState as jest.Mock).mockReturnValue('air_draw');

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      release: releaseMock,
    });

    try {
      await surfaceBattle(id as any, enemyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(`You cannot fight yourself`);
    }

    expect(pool.connect).not.toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
  it('should log draw', async () => {
    const id = 1;
    const enemyId = 2;

    const queryMock = jest.fn().mockResolvedValue({
      rows: [1],
    });

    (BattleState.prototype.getState as jest.Mock).mockReturnValue('air_draw');
    (BattleState.prototype.getEnemyId as jest.Mock).mockReturnValue(2);

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const mathRandomMock = jest.spyOn(Math, 'random');
    mathRandomMock.mockReturnValue(0.5);

    const result = await surfaceBattle(id as any, enemyId as any);

    mathRandomMock.mockRestore();
    expect(result.msg).toBe(
      `Somehow it was a draw! with your str ${0} versus enemy str ${0}. Coin was ${0.5}`,
    );

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });
});
