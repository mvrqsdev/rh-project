// Preset NestJS (backend Node.js).
// Uso: packages/server/eslint.config.mjs
import nestjsTyped from '@darraghor/eslint-plugin-nestjs-typed';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import tseslint from 'typescript-eslint';
import base, { prettier } from './base.mjs';

const TEST_FILES = ['**/*.spec.ts', '**/*.e2e-spec.ts', 'test/**/*.ts'];

/**
 * @param {{ tsconfigRootDir: string }} options
 *   tsconfigRootDir: passe `import.meta.dirname` no eslint.config.mjs do app.
 */
export default function nest({ tsconfigRootDir }) {
  return defineConfig(
    base,
    // Regras que usam o sistema de tipos do TypeScript.
    tseslint.configs.recommendedTypeChecked,
    {
      name: 'rh/nest/language',
      languageOptions: {
        sourceType: 'module',
        globals: { ...globals.node, ...globals.jest },
        parserOptions: {
          // Usa o tsconfig.json mais próximo de cada arquivo .ts.
          projectService: true,
          tsconfigRootDir,
        },
      },
    },

    // Plugin @darraghor/eslint-plugin-nestjs-typed: erros de DI, DTO e rotas
    // que o Nest só acusaria ao subir a aplicação.
    // Restrito a .ts com tipos: algumas regras do plugin exigem type-checking
    // e quebram em .js/.mjs e nos *.config.ts (ver rh/nest/untyped-files).
    {
      name: 'rh/nest/nestjs-typed',
      files: ['**/*.ts'],
      ignores: ['**/*.config.{ts,mts,cts}'],
      extends: [
        nestjsTyped.configs.flatRecommended,
        // O projeto não usa @nestjs/swagger: desliga as regras de Swagger.
        // Ao instalar @nestjs/swagger, remova esta linha.
        nestjsTyped.configs.flatNoSwagger,
      ],
      rules: {
        // Caminhos ABSOLUTOS: a regra resolve globs a partir do process.cwd(),
        // que muda conforme o ESLint é rodado (raiz, app ou VS Code).
        '@darraghor/nestjs-typed/injectable-should-be-provided': [
          'error',
          {
            src: [path.join(tsconfigRootDir, 'src/**/*.ts')],
            filterFromPaths: ['dist', 'node_modules', '.spec.', '.e2e-spec.'],
          },
        ],
      },
    },

    {
      name: 'rh/nest/rules',
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        // `private readonly` em dependências injetadas que não são reatribuídas.
        '@typescript-eslint/prefer-readonly': 'error',
        // Parâmetros/variáveis com prefixo `_` podem ficar sem uso
        // (ex.: `_context` em guards, interceptors e filters).
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        // Use o Logger do Nest (`new Logger(MinhaClasse.name)`).
        'no-console': 'warn',
      },
    },
    {
      // Jest e supertest geram falsos positivos nessas regras:
      // `expect(service.metodo)` → unbound-method; `response.body` é `any`.
      name: 'rh/nest/tests',
      files: TEST_FILES,
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
    {
      // Arquivos JS não têm tipos, e arquivos de config de ferramentas
      // (jest.config.ts, ...) usam APIs sem tipagem: desliga as regras
      // type-checked neles.
      name: 'rh/nest/untyped-files',
      files: ['**/*.{js,mjs,cjs}', '**/*.config.{ts,mts,cts}'],
      extends: [tseslint.configs.disableTypeChecked],
    },
    prettier,
  );
}
