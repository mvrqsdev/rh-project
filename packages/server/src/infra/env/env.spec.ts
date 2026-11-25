import { envSchema } from './env';

const DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

describe('envSchema', () => {
  it('aplica os defaults de PORT e NODE_ENV', () => {
    const env = envSchema.parse({ DATABASE_URL });

    expect(env.PORT).toBe(4000);
    expect(env.NODE_ENV).toBe('development');
  });

  it('converte PORT de string para número', () => {
    const env = envSchema.parse({ DATABASE_URL, PORT: '3000' });

    expect(env.PORT).toBe(3000);
  });

  it('aceita os valores válidos de NODE_ENV', () => {
    for (const NODE_ENV of ['development', 'production', 'test'] as const) {
      expect(envSchema.parse({ DATABASE_URL, NODE_ENV }).NODE_ENV).toBe(
        NODE_ENV,
      );
    }
  });

  it('rejeita NODE_ENV fora do enum', () => {
    expect(() =>
      envSchema.parse({ DATABASE_URL, NODE_ENV: 'staging' }),
    ).toThrow();
  });

  it('rejeita PORT que não é número', () => {
    expect(() => envSchema.parse({ DATABASE_URL, PORT: 'abc' })).toThrow();
  });

  it('exige DATABASE_URL', () => {
    expect(() => envSchema.parse({})).toThrow();
  });

  it('rejeita DATABASE_URL que não é URL', () => {
    expect(() => envSchema.parse({ DATABASE_URL: 'não-é-url' })).toThrow();
  });
});
