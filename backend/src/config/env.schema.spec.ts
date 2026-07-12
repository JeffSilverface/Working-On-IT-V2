import { envSchema } from './env.schema';

describe('envSchema', () => {
  const validEnv = {
    NODE_ENV: 'development',
    PORT: '3001',
    DATABASE_URL: 'postgresql://woi:woi@localhost:5432/working_on_it',
  };

  it('parses a valid environment', () => {
    const result = envSchema.parse(validEnv);
    expect(result).toEqual({
      NODE_ENV: 'development',
      PORT: 3001,
      DATABASE_URL: validEnv.DATABASE_URL,
    });
  });

  it('rejects an invalid NODE_ENV', () => {
    expect(() => envSchema.parse({ ...validEnv, NODE_ENV: 'local' })).toThrow();
  });

  it('rejects a missing DATABASE_URL', () => {
    const { NODE_ENV, PORT } = validEnv;
    expect(() => envSchema.parse({ NODE_ENV, PORT })).toThrow();
  });

  it('rejects a non-numeric PORT', () => {
    expect(() => envSchema.parse({ ...validEnv, PORT: 'abc' })).toThrow();
  });
});
