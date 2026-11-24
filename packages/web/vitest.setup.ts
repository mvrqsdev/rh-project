import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { AsyncLocalStorage } from 'node:async_hooks';
import { afterEach } from 'vitest';

// O Next espera o AsyncLocalStorage global, que o servidor dele define ao iniciar.
// Sem isso, um console.log em testes que importam
// `next/experimental/testing/server` lança erro.
Object.assign(globalThis, { AsyncLocalStorage });

// Sem `globals: true`, o cleanup automático do Testing Library não é registrado.
afterEach(() => {
  cleanup();
});
