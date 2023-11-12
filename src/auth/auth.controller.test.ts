import { Response, Request } from "express";
import { login, register, protectedRoute } from './auth.controller'
import { generateToken } from './auth.tokenGenerate';
import pool from '../application/db/db';

jest.mock('../application/db/db', () => ({
  connect: jest.fn(),
}));

jest.mock('./auth.tokenGenerate', () => ({
  generateToken: jest.fn(),
}));

describe('login', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        name: 'testUser',
        password: 'testPassword',
        email: 'test@example.com',
      },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
  });

  it('should login and return a token', async () => {
    const mockedUser = { id: 1, name: 'testUser', password: 'testPassword', email: 'test@example.com' };
    const mockedToken = 'mockedToken';

    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [mockedUser] }),
      release: jest.fn(),
    });

    (generateToken as jest.Mock).mockReturnValueOnce(mockedToken);

    await login(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ token: mockedToken });
  });

  it('should handle unauthorized access', async () => {
    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    });

    await login(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Wrong username, password, or email');
  });

  it('should handle internal server error', async () => {
    (pool.connect as jest.Mock).mockRejectedValue(new Error('Connection error'));

    await login(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});

describe('register', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        name: 'testUser',
        password: 'testPassword',
        email: 'test@example.com',
        type: 'user',
      },
    } as any;
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;
  });

  it('should register a new user', async () => {
    const mockedUser = { id: 1, name: 'testUser', password: 'testPassword', email: 'test@example.com', type: 'user' };

    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [mockedUser] }),
      release: jest.fn(),
    });

    await register(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockedUser);
  });

  it('should handle user already exists', async () => {
    (pool.connect as jest.Mock).mockResolvedValue({
      query: jest.fn().mockResolvedValueOnce({ rows: [1] }),
      release: jest.fn(),
    });

    await register(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('User with the same name or email already exists.');
  });

  it('should handle internal server error', async () => {
    (pool.connect as jest.Mock).mockRejectedValue(new Error('Connection error'));

    await register(req, res);

    expect(pool.connect).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal Server Error');
  });
});

describe('protectedRoute', () => {
  it('should return "Access Granted"', () => {
    const req = {} as any;
    const res = {
      send: jest.fn(),
    } as any;

    protectedRoute(req, res);

    expect(res.send).toHaveBeenCalledWith('Access Granted');
  });
});