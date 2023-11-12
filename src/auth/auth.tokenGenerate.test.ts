import dotenv from 'dotenv';
import { generateToken } from './auth.tokenGenerate';
import { User } from './types/auth.interfaces';
import { sha256 } from './auth.sha256';

dotenv.config();

jest.mock('./auth.sha256', () => ({
  sha256: jest.fn(),
}));

describe('generateToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a token with the correct structure', () => {
    const user: any = {
      id: 123,
      name: 'testUser',
    };

    const sKey = 'kitty';
    const mockedHeader = 'mockedHeader';
    const mockedPayload = 'mockedPayload';
    const mockedSignature = 'mockedSignature';

    jest
      .spyOn(Buffer, 'from')
      .mockReturnValueOnce({ toString: () => mockedHeader } as any)
      .mockReturnValueOnce({ toString: () => mockedPayload } as any);

    (sha256 as jest.Mock).mockReturnValueOnce(mockedSignature);

    const token = generateToken(user);

    expect(Buffer.from).toHaveBeenCalledWith(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    expect(Buffer.from).toHaveBeenCalledWith(
      JSON.stringify({ sub: user.id, username: user.name }),
    );
    expect(sha256).toHaveBeenCalledWith(
      mockedHeader + mockedPayload + process.env.SECRET_KEY,
    );
    expect(token).toEqual(
      `${mockedHeader}.${mockedPayload}.${mockedSignature}`,
    );
  });
});

