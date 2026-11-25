import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/infra/app.module';

describe('App (e2e)', () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Se o beforeAll falhar, `app` fica undefined; não mascara o erro real.
    await app?.close();
  });

  it('GET /health responde que a aplicação está no ar', async () => {
    const response = await request(app!.getHttpServer())
      .get('/health')
      .expect(200);

    const body = response.body as { success: boolean; date: string };

    expect(body.success).toBe(true);
    expect(Number.isNaN(Date.parse(body.date))).toBe(false);
  });
});
