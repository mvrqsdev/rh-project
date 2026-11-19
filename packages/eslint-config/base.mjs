// Preset base: regras comuns a TODOS os projetos do monorepo.
// Os presets de cada framework (nest.mjs, next.mjs, ...) partem daqui.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export const ignores = globalIgnores([
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
]);

export default defineConfig(
  ignores,
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    name: 'rh/base/rules',
    rules: {
      // Regras do projeto entram aqui (ver ESLINT-RULES.md).
    },
  },
);

// Sempre por último em cada preset final: desliga regras de estilo que
// brigariam com o Prettier.
export { prettier };
