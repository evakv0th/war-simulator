import { sha256 } from './auth.sha256';

describe('sha256', () => {
  it('should hash the input string', () => {
    const inputString = 'hello, world';

    const expectedHash =
      '09ca7e4eaa6e8ae9c7d261167129184883644d07dfba7cbfbc4c8a2e08360d5b';

      console.log('you can check sha256 tests - https://md5calc.com/hash/sha256/hello%2C+world')
    const result = sha256(inputString);

    expect(result).toBe(expectedHash);
  });
});
