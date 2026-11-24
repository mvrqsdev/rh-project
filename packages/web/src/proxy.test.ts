// @vitest-environment node
import { config, proxy } from '@/proxy';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('proxy', () => {
  beforeEach(() => {
    // O proxy registra o pathname; silencia para não poluir a saída dos testes.
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deixa a requisição seguir com NextResponse.next()', () => {
    const response = proxy(new NextRequest('http://localhost:3000/candidatos'));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
});

describe('config.matcher', () => {
  it.each(['/', '/candidatos', '/candidatos/1', '/next.svg'])(
    'executa o proxy em %s',
    (url) => {
      expect(unstable_doesMiddlewareMatch({ config, url })).toBe(true);
    },
  );

  it.each([
    '/api/candidatos',
    '/_next/static/chunks/main.js',
    '/_next/image',
    '/logo.png',
  ])('não executa o proxy em %s', (url) => {
    expect(unstable_doesMiddlewareMatch({ config, url })).toBe(false);
  });
});
