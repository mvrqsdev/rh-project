import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { EnvService } from './env.service';

describe('EnvService', () => {
  const get = jest.fn();
  let service: EnvService;

  beforeEach(async () => {
    get.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [EnvService, { provide: ConfigService, useValue: { get } }],
    }).compile();

    service = moduleRef.get(EnvService);
  });

  it('lê a variável do ConfigService com inferência de tipo', () => {
    get.mockReturnValue(4000);

    expect(service.get('PORT')).toBe(4000);
    expect(get).toHaveBeenCalledWith('PORT', { infer: true });
  });

  it('repassa a chave pedida', () => {
    get.mockReturnValue('postgresql://user:pass@localhost:5432/db');

    expect(service.get('DATABASE_URL')).toBe(
      'postgresql://user:pass@localhost:5432/db',
    );
    expect(get).toHaveBeenCalledWith('DATABASE_URL', { infer: true });
  });
});
