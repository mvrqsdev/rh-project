// Preset Next.js (frontend React).
// Uso: packages/web/eslint.config.mjs
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { ignores, prettier } from './base.mjs';

// O eslint-config-next já registra os plugins react, react-hooks, jsx-a11y,
// import, @next/next e @typescript-eslint (com o recommended do
// typescript-eslint). Por isso este preset NÃO espalha o `base` inteiro:
// registrar o plugin @typescript-eslint duas vezes gera erro. Reaproveitamos
// só os ignores, o recommended do JS e o prettier.
export default defineConfig(
  ignores,
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    name: 'rh/next/rules',
    rules: {
      // Regras do projeto web entram aqui (ver ESLINT-RULES.md).
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
  prettier,
);
