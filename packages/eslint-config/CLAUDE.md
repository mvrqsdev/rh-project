# CLAUDE.md: `@rh/eslint-config`

Instruções para IA (e humanos) que forem alterar a configuração do ESLint deste monorepo.

## O que é este pacote

Pacote **interno** do workspace (`packages/eslint-config`, nome `@rh/eslint-config`).
Ele centraliza as regras de lint. Cada app do monorepo importa o preset do seu framework:

| App                          | Arquivo                             | Preset importado                                                |
| ---------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| `packages/server` (NestJS)   | `packages/server/eslint.config.mjs` | `@rh/eslint-config/nest` (função, recebe `{ tsconfigRootDir }`) |
| `packages/web` (Next.js)     | `packages/web/eslint.config.mjs`    | `@rh/eslint-config/next` (array)                                |
| futuro mobile (React Native) | `packages/mobile/eslint.config.mjs` | `@rh/eslint-config/react-native` (ainda não existe; ver abaixo) |

## Divisão de responsabilidades

- **ESLint** cuida da **qualidade e correção do código**. Este pacote.
- **Prettier** cuida da **formatação**, via `.prettierrc` e `.prettierignore` na **raiz** do monorepo.
  - Todo preset termina com `prettier` (`eslint-config-prettier/flat`), que desliga as regras de estilo do ESLint.
  - **Nunca** adicione regras de estilo (indent, quotes, semi, comma-dangle, max-len, `@stylistic/*`) no ESLint, nem `eslint-plugin-prettier`. Para mudar a formatação, altere o `.prettierrc` da raiz.
- O VS Code está configurado em `.vscode/settings.json` (raiz): Prettier formata ao salvar e `source.fixAll.eslint` aplica os fixes.

## Arquivos

```
packages/eslint-config/
├── package.json          exports: ./base, ./nest, ./next  |  script: rules
├── base.mjs              @eslint/js recommended + typescript-eslint recommended + ignores
├── nest.mjs              base + recommendedTypeChecked + plugin nestjs-typed + globals node/jest
├── next.mjs              eslint-config-next (core-web-vitals + typescript) + @eslint/js recommended
├── scripts/print-rules.mjs   lista as regras efetivas de um arquivo
├── ESLINT-RULES.md       documentação de TODAS as regras ativas (manter atualizado!)
└── CLAUDE.md             este arquivo
```

### `base.mjs`

- `export default`: config base (array), usado pelo `nest.mjs` e pelo futuro `react-native.mjs`.
- `export { ignores }`: ignores globais (`node_modules`, `dist`, `build`, `coverage`).
- `export { prettier }`: `eslint-config-prettier/flat`, que deve ser **o último item** de cada preset final.
- Regras que devem valer em **todos** os projetos vão no bloco `name: 'rh/base/rules'`.

### `nest.mjs`

- É uma **função** porque as regras com tipos precisam do `tsconfigRootDir` do app (`import.meta.dirname`).
- Usa `parserOptions.projectService: true`, ou seja, o tsconfig mais próximo de cada arquivo.
- Arquivos `*.{js,mjs,cjs}` e `*.config.{ts,mts,cts}` recebem `tseslint.configs.disableTypeChecked`.
- Regras do backend vão no bloco `name: 'rh/nest/rules'`. Overrides de testes ficam em `rh/nest/tests`.
- **Plugin `@darraghor/eslint-plugin-nestjs-typed`** (bloco `rh/nest/nestjs-typed`):
  - Usa `flatRecommended` + `flatNoSwagger`. **Ao instalar `@nestjs/swagger`, remova o `flatNoSwagger`.**
  - O bloco tem `files: ['**/*.ts']` e `ignores: ['**/*.config.{ts,mts,cts}']`. As regras do plugin exigem type-checking e **quebram o ESLint inteiro** (`You have used a rule which requires type information`) se rodarem em arquivos sem tipos. O `tseslint.configs.disableTypeChecked` não desliga regras de plugins de terceiros, então mantenha esse escopo.
  - A regra `injectable-should-be-provided` resolve os globs de `src` a partir do `process.cwd()`. Por isso o `src` é montado como caminho **absoluto** com `path.join(tsconfigRootDir, 'src/**/*.ts')`. Não troque por caminho relativo.
  - Ela também mantém um cache do mapa de módulos. Se o VS Code continuar acusando _"Expected Injectable ... to be referenced"_ depois de registrar o provider, altere qualquer caractere no arquivo do service ou rode "ESLint: Restart ESLint Server".

### `next.mjs`

- **Não** espalha o `base` inteiro. O `eslint-config-next/typescript` já registra o plugin `@typescript-eslint`, e registrar o mesmo plugin duas vezes gera erro (`Cannot redefine plugin`). Ele reaproveita só `ignores`, `js.configs.recommended` e `prettier`.
- Regras do frontend vão no bloco `name: 'rh/next/rules'`.

## Como alterar uma regra

1. Escolha o **escopo**:
   - Todos os projetos: `base.mjs` (bloco `rh/base/rules`). Para valer também no Next, adicione no `rh/next/rules`, porque o `next.mjs` não importa o bloco de regras do base.
   - Só backend: `nest.mjs` (bloco `rh/nest/rules`).
   - Só frontend: `next.mjs` (bloco `rh/next/rules`).
   - Só **um app específico**: no `eslint.config.mjs` do próprio app, depois do preset.
   - Só em **alguns arquivos**: um bloco com `files: [...]` (ex.: `['**/*.spec.ts']`).
2. Formato: `'nome-da-regra': 'off' | 'warn' | 'error'` ou `['error', { ...opções }]`.
3. Rode o lint da raiz: `npm run lint`.
4. **Atualize o `ESLINT-RULES.md`** (veja abaixo).

Exemplo, no `nest.mjs`:

```js
{
  name: 'rh/nest/rules',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
},
```

## Como adicionar um plugin (ex.: `eslint-plugin-unicorn`, `eslint-plugin-simple-import-sort`)

1. Instale **neste pacote**, não no app: `npm install <plugin> -w @rh/eslint-config`.
2. Importe e adicione no preset correto (`base.mjs` se for genérico, ou `nest.mjs`/`next.mjs`), **antes** do `prettier`.
3. Antes de registrar um plugin, confira se o `eslint-config-next` já não o registra (ele já inclui `react`, `react-hooks`, `jsx-a11y`, `import`, `@next/next` e `@typescript-eslint`). Se já registra, apenas configure as `rules`, sem declarar o plugin de novo.
4. Plugins de **estilo/formatação** não devem ser adicionados (o Prettier cuida disso).
5. Atualize o `ESLINT-RULES.md`.

## Como criar o preset do React Native (app mobile)

1. Crie o app em `packages/mobile`.
2. Instale neste pacote o config do framework:
   - Expo (recomendado): `npm install eslint-config-expo -w @rh/eslint-config`
   - React Native puro: `npm install @react-native/eslint-config -w @rh/eslint-config`
3. Crie `react-native.mjs` seguindo o padrão do `next.mjs` (Expo):
   ```js
   import js from '@eslint/js';
   import { defineConfig } from 'eslint/config';
   import expo from 'eslint-config-expo/flat';
   import { ignores, prettier } from './base.mjs';

   export default defineConfig(
     ignores,
     js.configs.recommended,
     expo,
     { name: 'rh/react-native/rules', rules: {} },
     prettier,
   );
   ```
   Se o config do framework **não** registrar `@typescript-eslint`, use `base` em vez de `ignores` + `js.configs.recommended`.
4. Adicione no `exports` do `package.json`: `"./react-native": "./react-native.mjs"`.
5. No app: `"@rh/eslint-config": "*"` em `devDependencies`, scripts `"lint": "eslint ."` e `"lint:fix": "eslint . --fix"`, e um `eslint.config.mjs`:
   ```js
   import rn from '@rh/eslint-config/react-native';
   import { defineConfig } from 'eslint/config';
   export default defineConfig(rn);
   ```
6. Rode `npm install` na raiz, depois `npm run lint`, e adicione a coluna "Mobile" no `ESLINT-RULES.md`.

## Manter o `ESLINT-RULES.md` atualizado

O `ESLINT-RULES.md` documenta toda regra ativa (nome, valor em cada preset, se tem auto-fix,
o que faz em português e as opções). Ele é a referência do time, então mantenha-o fiel à config.

Para ver as regras efetivas (com severidade e opções reais), rode da raiz:

```bash
npm run rules -w @rh/eslint-config -- packages/server src/main.ts
npm run rules -w @rh/eslint-config -- packages/web src/app/page.tsx
```

Compare a saída com o `ESLINT-RULES.md`, adicione/remova linhas e traduza as descrições para português.

## Restrições importantes

- **TypeScript 7 x typescript-eslint**: o TS 7 ainda não tem API, e o typescript-eslint suporta apenas `typescript >=4.8.4 <6.1.0`. Por isso o `package.json` da **raiz** usa aliases:
  ```json
  "@typescript/native": "npm:typescript@^7.0.2",
  "typescript": "npm:@typescript/typescript6@^6.0.2"
  ```
  O pacote `typescript` resolve para a API do TS 6 (usada pelo typescript-eslint), e o `@typescript/native` é o TS 7. **Não** troque `typescript` na raiz por `^7` enquanto o typescript-eslint não suportar TS 7 (acompanhe https://github.com/typescript-eslint/typescript-eslint/issues/10940), ou o lint quebra com `typescript-eslint does not support TS 7.0`.
- **ESLint 9**: mantenha `eslint@^9` (na raiz). O `eslint-config-next` e plugins como `eslint-plugin-react` podem não suportar o ESLint 10 ainda. Antes de subir a versão, confirme o suporte de todos.
- O `@darraghor/eslint-plugin-nestjs-typed` tem `class-validator` como peer dependency (instalado no `server`) e exige Node >= 24.
- A versão do `eslint-config-next` deve ser **igual** à do `next` em `packages/web`. Ao atualizar o Next, atualize aqui também.
- `eslint` e `prettier` ficam instalados na **raiz** (`devDependencies`). Os apps não declaram `eslint` diretamente.
- Os configs usam **flat config** (`eslint.config.mjs` + `defineConfig`). Não crie `.eslintrc*`.
- Todo bloco de config deve ter `name: 'rh/<preset>/<assunto>'`. Isso facilita o debug com `npx eslint --inspect-config`.

## Comandos úteis (da raiz)

| Comando                                       | O que faz                                             |
| --------------------------------------------- | ----------------------------------------------------- |
| `npm run lint`                                | Roda o ESLint em todos os apps.                       |
| `npm run lint:fix`                            | Roda o ESLint com `--fix` em todos os apps.           |
| `npm run format`                              | Formata o repo inteiro com o Prettier.                |
| `npm run format:check`                        | Verifica a formatação sem alterar nada (bom para CI). |
| `npm run lint -w packages/server`             | Lint de um app só.                                    |
| `npx eslint --inspect-config` (dentro do app) | Abre um visualizador da config efetiva.               |
