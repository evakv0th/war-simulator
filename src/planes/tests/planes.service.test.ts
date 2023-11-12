import {
  getPlanes,
  getPlaneById,
  postPlane,
  updatePlane,
  deletePlane,
  assignPlaneToArmy,
  removePlaneFromArmy,
} from '../planes.service';
import { pool } from '../../application/db/db';
import { planesForTest } from '../types/plames.for-test.array';
import HttpException from '../../application/exceptions/http-exceptions';
import { Plane, PlanesCreateSchema } from '../types/planes.interfaces';
import { armiesForTest } from '../../armies/types/armies.for-test.array';

jest.mock('../../application/db/db');

describe('getPlanes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return planes from the database', async () => {
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest,
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const planes = await getPlanes();

    expect(planes).toHaveLength(2);
    expect(planes[1].name).toBe('plane2');

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
      await getPlanes();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('getPlaneById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return plane by id', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const plane = await getPlaneById(id as any);

    expect(plane).toBeTruthy();
    expect(plane.id).toBe(id);
    expect(plane.name).toBe('plane1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or plane does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await getPlaneById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`plane with id:${id} not found`);
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
      await getPlaneById(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('postPlane', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if plane already here', async () => {
    const newPlane: PlanesCreateSchema = {
      name: planesForTest[0].name,
      air_strength: 100,
      surface_strength: 50,
      fuel_req: 100,
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.name === newPlane.name),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await postPlane(newPlane);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(400);
      expect((error as any).message).toBe(
        `Plane with that name ${planesForTest[0].name} already registered`,
      );
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error 500 if plane creation failed', async () => {
    const newPlane: PlanesCreateSchema = {
      name: planesForTest[0].name,
      air_strength: 100,
      surface_strength: 50,
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
      await postPlane(newPlane);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(500);
      expect((error as any).message).toBe(`Plane creation failed`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return plane after creation', async () => {
    const newPlane: PlanesCreateSchema = {
      name: '123333333333333333333333',
      air_strength: 100,
      surface_strength: 50,
      fuel_req: 100,
    };
    const queryMock = jest.fn();
    queryMock
      .mockImplementationOnce(() => {
        return { rows: [] };
      })
      .mockImplementationOnce(() => {
        return { rows: [newPlane] };
      });
    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const plane = await postPlane(newPlane);

    expect(plane).toEqual(newPlane);

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
      await postPlane({ name: 'jeff1' } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('updatePlane', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or plane does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updatePlane(id as any, { name: 'jeff1' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`plane not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong no valid field for update', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.find((a) => (a.id = id)),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await updatePlane(id as any, { nam: 'jeff' } as any);
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

  it('should return updated plane', async () => {
    const id = 1;
    const updatedInfo = {
      name: 'jeff',
    };
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const plane = await updatePlane(id as any, updatedInfo);

    expect(plane).toEqual(planesForTest[0]);

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
      await updatePlane(id as any, '21312' as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('deletePlane', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return plane after deleting (therefore its still will be no content in controller)', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const plane = await deletePlane(id as any);

    expect(plane).toBeTruthy();
    expect(plane.id).toBe(id);
    expect(plane.name).toBe('plane1');

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
      await deletePlane(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('assignPlaneToArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if wrong id or plane does not exist', async () => {
    const id = 99;
    const armyId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await assignPlaneToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`plane with id:${id} not found`);
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
      await assignPlaneToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`Army not found`);
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should return plane after assigning', async () => {
    const id = 1;
    const armyId = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const plane = await assignPlaneToArmy(id as any, armyId as any);

    expect(plane).toEqual(planesForTest[0]);

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
      await assignPlaneToArmy(id as any, armyId as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});

describe('removePlaneFromArmy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return plane after removing from army', async () => {
    const id = 1;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    const plane = await removePlaneFromArmy(id as any);

    expect(plane).toBeTruthy();
    expect(plane.id).toBe(id);
    expect(plane.name).toBe('plane1');

    expect(pool.connect).toHaveBeenCalled();
    expect(queryMock).toHaveBeenCalled();
    expect(releaseMock).toHaveBeenCalled();
  });

  it('should throw error if wrong id or plane does not exist', async () => {
    const id = 99;
    const queryMock = jest.fn().mockResolvedValue({
      rows: planesForTest.filter((a) => a.id === id),
    });

    const releaseMock = jest.fn();

    (pool.connect as jest.Mock).mockResolvedValue({
      query: queryMock,
      release: releaseMock,
    });

    try {
      await removePlaneFromArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).status).toBe(404);
      expect((error as any).message).toBe(`plane with id:${id} not found`);
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
      await removePlaneFromArmy(id as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as any).message).toBe('Connection error');
    }

    expect(pool.connect).toHaveBeenCalled();
    expect(releaseMock).not.toHaveBeenCalled();
  });
});
