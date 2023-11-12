import {
  getSquads,
  getSquadById,
  postSquad,
  updateSquad,
  deleteSquad,
  assignSquadToArmy,
  removeSquadFromArmy,
} from '../squads.service';
import { pool } from '../../application/db/db';
import { squadsForTest } from '../types/squads.for-test.array';
import HttpException from '../../application/exceptions/http-exceptions';
import { Squad, SquadsCreateSchema } from '../types/squads.interfaces';
import { armiesForTest } from '../../armies/types/armies.for-test.array';

jest.mock('../../application/db/db');

describe('getSquads', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Squads from the database', async () => {
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest,
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const squads = await getSquads();

    expect(squads).toHaveLength(2);
    expect(squads[1].name).toBe('squad2');

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
      await getSquads();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('getSquadById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return squad by id', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const squad = await getSquadById(id as any);

    expect(squad).toBeTruthy();
    expect(squad.id).toBe(id);
    expect(squad.name).toBe('squad1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or Squad does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await getSquadById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`squad with id:${id} not found`);
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
      await getSquadById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('postSquad', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if squad already here', async () => {
    const newSquad: SquadsCreateSchema = {
      name: squadsForTest[0].name,
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.name === newSquad.name),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await postSquad(newSquad);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `Squad with that name ${squadsForTest[0].name} already registered`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error 500 if Squad creation failed', async () => {
    const newSquad: SquadsCreateSchema = {
      name: squadsForTest[0].name,
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
      await postSquad(newSquad);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(500);
      expect((error as any).message).toBe(`Squad creation failed`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return Squad after creation', async () => {
    const newSquad: SquadsCreateSchema = {
      name: '123333333333333333333333',
    };
    const queryMock = jest.fn();
    queryMock
      .mockImplementationOnce(() => {
        return { rows: [] };
      })
      .mockImplementationOnce(() => {
        return { rows: [newSquad] };
      });
    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Squad = await postSquad(newSquad);

    expect(Squad).toEqual(newSquad);

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
      await postSquad({ name: 'jeff1' } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('updateSquad', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or Squad does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateSquad(id as any, { name: 'jeff1' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`squad not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong no valid field for update', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updateSquad(id as any, { nam: 'jeff' } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `No valid fields provided for update`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
  });

  it('should return updated Squad', async () => {
    const id = 1;
    const updatedInfo = {
      name: 'jeff',
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const squad = await updateSquad(id as any, updatedInfo);

    expect(squad).toEqual(squadsForTest[0]);

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
      await updateSquad(id as any, '21312' as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('deleteSquad', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return squad after deleting (therefore its still will be no content in controller)', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Squad = await deleteSquad(id as any);

    expect(Squad).toBeTruthy();
    expect(Squad.id).toBe(id);
    expect(Squad.name).toBe('squad1');

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
      await deleteSquad(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('assignSquadToArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or Squad does not exist', async () => {
    const id = 99;
    const armyId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await assignSquadToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`squad with id:${id} not found`);
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
      await assignSquadToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`Army not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return Squad after assigning', async () => {
    const id = 1;
    const armyId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Squad = await assignSquadToArmy(id as any, armyId as any);

    expect(Squad).toEqual(squadsForTest[0]);

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
      await assignSquadToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('removeSquadFromArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Squad after removing from army', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const Squad = await removeSquadFromArmy(id as any);

    expect(Squad).toBeTruthy();
    expect(Squad.id).toBe(id);
    expect(Squad.name).toBe('squad1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or Squad does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: squadsForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await removeSquadFromArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`squad with id:${id} not found`);
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
      await removeSquadFromArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});
