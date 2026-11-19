# Regras do ESLint

Este arquivo lista **todas as regras ativas** em cada preset de `@rh/eslint-config`
e explica o que cada uma faz.

> Gerado a partir da configuração efetiva (`npm run rules -w @rh/eslint-config`)
> com ESLint 9.39, typescript-eslint 8.73, eslint-config-next 16.4.6 e
> @darraghor/eslint-plugin-nestjs-typed 7.5.
> Sempre que mudar uma regra ou atualizar um desses pacotes, atualize este arquivo.

## Como ler

### Colunas

| Coluna        | Significado                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| **Nest**      | Valor da regra no preset `nest` (`packages/server`). `—` = regra não está ativa. |
| **Next**      | Valor da regra no preset `next` (`packages/web`). `—` = regra não está ativa.    |
| **🔧**        | A regra tem correção automática (`eslint --fix` ou salvar no VS Code).           |
| **O que faz** | O que a regra verifica.                                                          |
| **Opções**    | Opções que a regra aceita. Entre parênteses, o valor que está em uso hoje.       |

### Valores possíveis de qualquer regra

Toda regra aceita uma destas severidades:

| Valor     | Equivalente | Efeito                                                          |
| --------- | ----------- | --------------------------------------------------------------- |
| `"off"`   | `0`         | Desliga a regra.                                                |
| `"warn"`  | `1`         | Mostra um aviso (amarelo), mas **não** quebra o `npm run lint`. |
| `"error"` | `2`         | Mostra um erro (vermelho) e o `npm run lint` termina com falha. |

Quando a regra tem opções, use um array: `[severidade, opções]`.

```js
rules: {
  'no-console': 'warn',                                   // só severidade
  'no-empty': ['error', { allowEmptyCatch: true }],        // severidade + opções
  'no-cond-assign': ['error', 'always'],                   // opção em string
}
```

Onde mudar: veja a seção _"Como alterar uma regra"_ no [`CLAUDE.md`](./CLAUDE.md).

---

## 1. ESLint (núcleo): `@eslint/js` recommended

Valem para **todos** os projetos. Algumas regras do recommended (como `no-undef`,
`no-dupe-keys` e `no-unreachable`) foram desligadas automaticamente pelo
typescript-eslint, porque o próprio compilador do TypeScript já faz essas verificações.

| Regra                             | Nest  | Next  | 🔧  | O que faz                                                                                        | Opções                                                                                                                         |
| --------------------------------- | ----- | ----- | --- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `for-direction`                   | error | error |     | Proíbe `for` cujo contador anda na direção errada (loop infinito).                               | —                                                                                                                              |
| `no-async-promise-executor`       | error | error |     | Proíbe `new Promise(async (resolve) => ...)`; erros dentro dele se perdem.                       | —                                                                                                                              |
| `no-case-declarations`            | error | error |     | Proíbe `let`/`const`/`function`/`class` direto num `case` sem `{ }`.                             | —                                                                                                                              |
| `no-compare-neg-zero`             | error | error |     | Proíbe `x === -0` (não funciona; use `Object.is(x, -0)`).                                        | —                                                                                                                              |
| `no-cond-assign`                  | error | error |     | Proíbe atribuição dentro de condição (`if (x = 1)`).                                             | `"except-parens"` (em uso: permite se estiver entre parênteses extras) ou `"always"` (proíbe sempre).                          |
| `no-constant-binary-expression`   | error | error |     | Proíbe expressões cujo resultado é sempre o mesmo (`a + b ?? c`, `x === []`).                    | —                                                                                                                              |
| `no-constant-condition`           | error | error |     | Proíbe condições constantes (`if (true)`).                                                       | `checkLoops`: `"all"`, `"allExceptWhileTrue"` (em uso), `"none"`.                                                              |
| `no-control-regex`                | error | error |     | Proíbe caracteres de controle (`\x00`–`\x1F`) em regex.                                          | —                                                                                                                              |
| `no-debugger`                     | error | error |     | Proíbe `debugger`.                                                                               | —                                                                                                                              |
| `no-delete-var`                   | error | error |     | Proíbe `delete` em variáveis.                                                                    | —                                                                                                                              |
| `no-dupe-else-if`                 | error | error |     | Proíbe condições repetidas numa cadeia `if / else if`.                                           | —                                                                                                                              |
| `no-duplicate-case`               | error | error |     | Proíbe `case` repetido num `switch`.                                                             | —                                                                                                                              |
| `no-empty`                        | error | error |     | Proíbe blocos vazios `{}` (comentário dentro conta como não vazio).                              | `allowEmptyCatch` (`false`): permite `catch {}` vazio.                                                                         |
| `no-empty-character-class`        | error | error |     | Proíbe `[]` vazio em regex.                                                                      | —                                                                                                                              |
| `no-empty-pattern`                | error | error |     | Proíbe desestruturação vazia (`const {} = obj`).                                                 | `allowObjectPatternsAsParameters` (`false`): permite `function f({}) {}`.                                                      |
| `no-empty-static-block`           | error | error |     | Proíbe `static {}` vazio em classes.                                                             | —                                                                                                                              |
| `no-ex-assign`                    | error | error |     | Proíbe reatribuir o erro do `catch (e)`.                                                         | —                                                                                                                              |
| `no-extra-boolean-cast`           | error | error | 🔧  | Proíbe conversões booleanas inúteis (`if (!!x)`).                                                | `enforceForInnerExpressions`: também verifica dentro de `&&`, `\|\|` e `?:`.                                                   |
| `no-fallthrough`                  | error | error |     | Proíbe um `case` "cair" no próximo sem `break` (a menos que haja comentário `// falls through`). | `commentPattern` (regex do comentário), `allowEmptyCase` (`false`), `reportUnusedFallthroughComment` (`false`).                |
| `no-global-assign`                | error | error |     | Proíbe sobrescrever globais (`window = ...`, `undefined = ...`).                                 | `exceptions` (`[]`): lista de globais liberadas.                                                                               |
| `no-invalid-regexp`               | error | error |     | Proíbe regex inválida em `new RegExp(...)`.                                                      | `allowConstructorFlags`: flags extras permitidas.                                                                              |
| `no-irregular-whitespace`         | error | error |     | Proíbe espaços "invisíveis" (NBSP, zero-width etc.).                                             | `skipStrings` (`true`), `skipComments` (`false`), `skipTemplates` (`false`), `skipRegExps` (`false`), `skipJSXText` (`false`). |
| `no-loss-of-precision`            | error | error |     | Proíbe números literais que perdem precisão (`9007199254740993`).                                | —                                                                                                                              |
| `no-misleading-character-class`   | error | error |     | Proíbe emojis/caracteres compostos dentro de `[...]` em regex.                                   | `allowEscape` (`false`).                                                                                                       |
| `no-nonoctal-decimal-escape`      | error | error |     | Proíbe `\8` e `\9` em strings.                                                                   | —                                                                                                                              |
| `no-octal`                        | error | error |     | Proíbe literais octais (`071`).                                                                  | —                                                                                                                              |
| `no-prototype-builtins`           | error | error |     | Proíbe `obj.hasOwnProperty(x)`; use `Object.hasOwn(obj, x)`.                                     | —                                                                                                                              |
| `no-regex-spaces`                 | error | error | 🔧  | Proíbe vários espaços seguidos em regex (use `{n}`).                                             | —                                                                                                                              |
| `no-self-assign`                  | error | error |     | Proíbe `x = x`.                                                                                  | `props` (`true`): também verifica `obj.a = obj.a`.                                                                             |
| `no-shadow-restricted-names`      | error | error |     | Proíbe criar variáveis chamadas `undefined`, `NaN`, `Infinity`, `eval`, `arguments`.             | `reportGlobalThis` (`false`): também proíbe `globalThis`.                                                                      |
| `no-sparse-arrays`                | error | error |     | Proíbe arrays com buracos (`[1,,3]`).                                                            | —                                                                                                                              |
| `no-unsafe-finally`               | error | error |     | Proíbe `return`/`throw`/`break` dentro de `finally`.                                             | —                                                                                                                              |
| `no-unsafe-optional-chaining`     | error | error |     | Proíbe usar `?.` onde `undefined` quebra (`new (obj?.Foo)()`, `[...obj?.arr]`).                  | `disallowArithmeticOperators` (`false`): também proíbe `obj?.a + 1`.                                                           |
| `no-unused-labels`                | error | error | 🔧  | Proíbe labels não usados.                                                                        | —                                                                                                                              |
| `no-unused-private-class-members` | error | error |     | Proíbe membros `#privados` de classe que nunca são usados.                                       | —                                                                                                                              |
| `no-useless-backreference`        | error | error |     | Proíbe backreferences em regex que nunca casam.                                                  | —                                                                                                                              |
| `no-useless-catch`                | error | error |     | Proíbe `catch (e) { throw e }` (não faz nada).                                                   | —                                                                                                                              |
| `no-useless-escape`               | error | error |     | Proíbe escapes desnecessários (`"\a"`, `/\:/`).                                                  | `allowRegexCharacters` (`[]`): caracteres liberados em regex.                                                                  |
| `no-var`                          | error | error | 🔧  | Exige `let`/`const` em vez de `var`.                                                             | —                                                                                                                              |
| `prefer-const`                    | error | error | 🔧  | Exige `const` quando a variável nunca é reatribuída.                                             | `destructuring`: `"any"` (em uso) ou `"all"`; `ignoreReadBeforeAssign` (`false`).                                              |
| `prefer-rest-params`              | error | error |     | Exige `...args` em vez de `arguments`.                                                           | —                                                                                                                              |
| `prefer-spread`                   | error | error |     | Exige `fn(...args)` em vez de `fn.apply(null, args)`.                                            | —                                                                                                                              |
| `require-yield`                   | error | error |     | Exige pelo menos um `yield` em `function*`.                                                      | —                                                                                                                              |
| `use-isnan`                       | error | error |     | Exige `Number.isNaN(x)` em vez de `x === NaN`.                                                   | `enforceForSwitchCase` (`true`), `enforceForIndexOf` (`false`): também verifica `.indexOf(NaN)`.                               |
| `valid-typeof`                    | error | error |     | Exige que `typeof x ===` seja comparado com um tipo válido (`"string"`, `"object"`...).          | `requireStringLiterals` (`false`): só permite comparar com string literal.                                                     |

---

## 2. TypeScript: `typescript-eslint` recommended

Valem para **todos** os projetos. No Next elas vêm do `eslint-config-next/typescript`.

| Regra                                                    | Nest               | Next     | 🔧  | O que faz                                                                                                                                                  | Opções                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------- | ------------------ | -------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/ban-ts-comment`                      | error              | error    |     | Proíbe `// @ts-ignore` e `// @ts-nocheck`; `// @ts-expect-error` só com descrição.                                                                         | `ts-ignore`, `ts-expect-error`, `ts-nocheck`, `ts-check`: `true` (proíbe), `false` (libera) ou `"allow-with-description"`; `minimumDescriptionLength`.                                                                                                                             |
| `@typescript-eslint/no-array-constructor`                | error              | error    | 🔧  | Proíbe `new Array(1, 2)`; use `[1, 2]`.                                                                                                                    | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-duplicate-enum-values`            | error              | error    |     | Proíbe dois membros de enum com o mesmo valor.                                                                                                             | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-empty-object-type`                | error              | error    |     | Proíbe o tipo `{}` e `interface X {}` vazias (aceitam quase qualquer coisa).                                                                               | `allowInterfaces`: `"never"`, `"always"`, `"with-single-extends"`; `allowObjectTypes`: `"never"`, `"always"`; `allowWithName` (regex).                                                                                                                                             |
| `@typescript-eslint/no-explicit-any`                     | **off**            | error    | 🔧  | Proíbe o tipo `any`. **Desligada no Nest** (decisão do projeto).                                                                                           | `fixToUnknown` (troca por `unknown` no fix), `ignoreRestArgs` (libera `...args: any[]`).                                                                                                                                                                                           |
| `@typescript-eslint/no-extra-non-null-assertion`         | error              | error    | 🔧  | Proíbe `x!!`.                                                                                                                                              | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-misused-new`                      | error              | error    |     | Proíbe `new()` em interface e `constructor` como nome de método.                                                                                           | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-namespace`                        | error              | error    |     | Proíbe `namespace X {}`; use módulos ES (`import`/`export`).                                                                                               | `allowDeclarations`, `allowDefinitionFiles` (libera em `.d.ts`).                                                                                                                                                                                                                   |
| `@typescript-eslint/no-non-null-asserted-optional-chain` | error              | error    |     | Proíbe `obj?.a!` (contraditório).                                                                                                                          | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-require-imports`                  | error              | error    |     | Proíbe `require()`; use `import`.                                                                                                                          | `allow` (lista de módulos liberados), `allowAsImport`.                                                                                                                                                                                                                             |
| `@typescript-eslint/no-this-alias`                       | error              | error    |     | Proíbe `const self = this`; use arrow function.                                                                                                            | `allowDestructuring`, `allowedNames`.                                                                                                                                                                                                                                              |
| `@typescript-eslint/no-unnecessary-type-constraint`      | error              | error    |     | Proíbe `<T extends any>` / `<T extends unknown>`.                                                                                                          | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-unsafe-declaration-merging`       | error              | error    |     | Proíbe interface e classe com o mesmo nome (mescla insegura).                                                                                              | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-unsafe-function-type`             | error              | error    |     | Proíbe o tipo `Function`; use uma assinatura (`() => void`).                                                                                               | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/no-unused-expressions`               | error              | **warn** |     | Proíbe expressões sem efeito (`a && b();`, `x;`).                                                                                                          | `allowShortCircuit` (`false`), `allowTernary` (`false`), `allowTaggedTemplates` (`false`), `enforceForJSX`, `ignoreDirectives`.                                                                                                                                                    |
| `@typescript-eslint/no-unused-vars`                      | error (com opções) | **warn** | 🔧  | Proíbe variáveis, parâmetros e imports não usados. **No Nest**, nomes que começam com `_` são ignorados (ex.: `_context`), assim como irmãos de `...rest`. | Em uso no Nest: `argsIgnorePattern`, `varsIgnorePattern`, `caughtErrorsIgnorePattern` e `destructuredArrayIgnorePattern` = `"^_"`; `ignoreRestSiblings: true`. Outras: `vars`: `"all"`/`"local"`; `args`: `"after-used"`/`"all"`/`"none"`; `caughtErrors`; `enableAutofixRemoval`. |
| `@typescript-eslint/no-wrapper-object-types`             | error              | error    | 🔧  | Proíbe `String`, `Number`, `Boolean` como tipo; use `string`, `number`, `boolean`.                                                                         | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/prefer-as-const`                     | error              | error    | 🔧  | Exige `as const` em vez de `'a' as 'a'`.                                                                                                                   | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/prefer-namespace-keyword`            | error              | error    | 🔧  | Exige `namespace` em vez de `module` para declarar módulos TS.                                                                                             | —                                                                                                                                                                                                                                                                                  |
| `@typescript-eslint/triple-slash-reference`              | error              | error    |     | Proíbe `/// <reference path="..." />`; use `import`.                                                                                                       | `lib`, `path`, `types`: `"always"`, `"never"`, `"prefer-import"`.                                                                                                                                                                                                                  |

---

## 3. TypeScript com tipos: `typescript-eslint` recommendedTypeChecked

**Só no Nest.** Estas regras usam o compilador do TypeScript (via `projectService`)
para entender os tipos. São mais lentas, mas pegam bugs que nenhuma outra regra pega.
Ficam desligadas em arquivos `.js/.mjs/.cjs` e `*.config.ts`.

| Regra                                               | Nest  | Next | 🔧  | O que faz                                                                                       | Opções                                                                                                                                              |
| --------------------------------------------------- | ----- | ---- | --- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/await-thenable`                 | error | —    |     | Proíbe `await` em algo que não é Promise.                                                       | —                                                                                                                                                   |
| `@typescript-eslint/no-array-delete`                | error | —    |     | Proíbe `delete arr[i]` (deixa buraco); use `splice`.                                            | —                                                                                                                                                   |
| `@typescript-eslint/no-base-to-string`              | error | —    |     | Proíbe converter em string objetos que viram `"[object Object]"`.                               | `ignoredTypeNames`, `checkUnknown`.                                                                                                                 |
| `@typescript-eslint/no-duplicate-type-constituents` | error | —    | 🔧  | Proíbe tipos repetidos em união/interseção (`string \| string`).                                | `ignoreUnions`, `ignoreIntersections`.                                                                                                              |
| `@typescript-eslint/no-floating-promises`           | error | —    |     | **Exige tratar toda Promise** (`await`, `.then/.catch`, `return` ou `void`). Essencial no Nest. | `ignoreVoid` (`true` por padrão: `void promise()` é aceito), `ignoreIIFE`, `checkThenables`, `allowForKnownSafePromises`, `allowForKnownSafeCalls`. |
| `@typescript-eslint/no-for-in-array`                | error | —    |     | Proíbe `for...in` em arrays; use `for...of`.                                                    | —                                                                                                                                                   |
| `@typescript-eslint/no-implied-eval`                | error | —    |     | Proíbe `setTimeout("código")`, `new Function("...")`.                                           | —                                                                                                                                                   |
| `@typescript-eslint/no-misused-promises`            | error | —    |     | Proíbe Promise onde não é esperada (`if (promise)`, callback `async` em `forEach`).             | `checksConditionals`, `checksVoidReturn`, `checksSpreads` (todas `true` por padrão).                                                                |
| `@typescript-eslint/no-redundant-type-constituents` | error | —    |     | Proíbe membros de união que não fazem nada (`string \| any`, `'a' \| string`).                  | —                                                                                                                                                   |
| `@typescript-eslint/no-unnecessary-type-assertion`  | error | —    | 🔧  | Proíbe `as X` ou `!` que não muda o tipo.                                                       | `typesToIgnore`, `checkLiteralConstAssertions`.                                                                                                     |
| `@typescript-eslint/no-unsafe-argument`             | error | —    |     | Proíbe passar um valor `any` como argumento.                                                    | —                                                                                                                                                   |
| `@typescript-eslint/no-unsafe-assignment`           | error | —    |     | Proíbe atribuir um valor `any` a variável ou propriedade.                                       | —                                                                                                                                                   |
| `@typescript-eslint/no-unsafe-call`                 | error | —    |     | Proíbe chamar como função um valor `any`.                                                       | —                                                                                                                                                   |
| `@typescript-eslint/no-unsafe-enum-comparison`      | error | —    |     | Proíbe comparar enum com valor que não é do enum (`status === 'ativo'`).                        | —                                                                                                                                                   |
| `@typescript-eslint/no-unsafe-member-access`        | error | —    |     | Proíbe acessar propriedade de um valor `any` (`anyValue.foo`).                                  | `allowOptionalChaining`.                                                                                                                            |
| `@typescript-eslint/no-unsafe-return`               | error | —    |     | Proíbe retornar `any` de uma função.                                                            | —                                                                                                                                                   |
| `@typescript-eslint/no-unsafe-unary-minus`          | error | —    |     | Proíbe `-x` quando `x` não é número/bigint.                                                     | —                                                                                                                                                   |
| `@typescript-eslint/only-throw-error`               | error | —    |     | Exige `throw new Error(...)`; proíbe `throw 'texto'`.                                           | `allow`, `allowThrowingAny`, `allowThrowingUnknown`, `allowRethrowing`.                                                                             |
| `@typescript-eslint/prefer-promise-reject-errors`   | error | —    |     | Exige `reject(new Error(...))` em Promises.                                                     | `allow`, `allowEmptyReject`, `allowThrowingAny`, `allowThrowingUnknown`.                                                                            |
| `@typescript-eslint/require-await`                  | error | —    |     | Proíbe função `async` sem nenhum `await`.                                                       | —                                                                                                                                                   |
| `@typescript-eslint/restrict-plus-operands`         | error | —    |     | Exige que os dois lados de `+` sejam do mesmo tipo (`number`, `string` ou `bigint`).            | `allowAny`, `allowBoolean`, `allowNullish`, `allowNumberAndString`, `allowRegExp`, `skipCompoundAssignments`.                                       |
| `@typescript-eslint/restrict-template-expressions`  | error | —    |     | Restringe o que pode ir em `` `${...}` `` (só string, number etc.; proíbe objetos).             | `allowAny`, `allowArray`, `allowBoolean`, `allowNullish`, `allowNumber`, `allowRegExp`, `allowNever`, `allow`.                                      |
| `@typescript-eslint/unbound-method`                 | error | —    |     | Proíbe passar método de classe solto (`const f = obj.metodo`), que perde o `this`.              | `ignoreStatic`.                                                                                                                                     |

---

## 4. Regras extras do projeto (Nest)

**Só no Nest.** Não fazem parte de nenhum preset recomendado; foram escolhidas para
o backend e ficam no bloco `rh/nest/rules` do `nest.mjs`.

| Regra                                | Nest  | Next | 🔧  | O que faz                                                                                                                                                                                                         | Opções                                                                 |
| ------------------------------------ | ----- | ---- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `@typescript-eslint/prefer-readonly` | error | —    | 🔧  | Exige `readonly` em membros `private` que nunca são reatribuídos fora do construtor. É a convenção do Nest para dependências injetadas: `constructor(private readonly usersService: UsersService) {}`. Usa tipos. | `onlyInlineLambdas`: só verifica propriedades que são arrow functions. |
| `no-console`                         | warn  | —    |     | Avisa sobre `console.log`/`console.error`... Use o `Logger` do Nest (`new Logger(MinhaClasse.name)`), que respeita nível e formato de log.                                                                        | `allow`: métodos liberados (ex.: `["warn", "error"]`).                 |

### Regras desligadas em testes

Em `**/*.spec.ts`, `**/*.e2e-spec.ts` e `test/**/*.ts` (bloco `rh/nest/tests`), estas
regras ficam **off**, porque Jest e supertest geram falsos positivos
(`expect(service.metodo)` parece "método solto" e `response.body` é `any`):

`@typescript-eslint/unbound-method`, `@typescript-eslint/no-unsafe-argument`,
`@typescript-eslint/no-unsafe-assignment`, `@typescript-eslint/no-unsafe-call`,
`@typescript-eslint/no-unsafe-member-access`, `@typescript-eslint/no-unsafe-return`.

---

## 5. NestJS: `@darraghor/eslint-plugin-nestjs-typed`

**Só no Nest**, e só em arquivos `.ts` (fora `*.config.ts`). Pega erros que o Nest
só acusaria **ao subir a aplicação** (DI, DTOs, rotas). Vem do `flatRecommended`
do plugin, mais o `flatNoSwagger` (o projeto não usa `@nestjs/swagger`). Todas usam tipos.

| Regra                                                                           | Nest  | Next | 🔧  | O que faz                                                                                                                                                                                                     | Opções                                                                                                                             |
| ------------------------------------------------------------------------------- | ----- | ---- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `@darraghor/nestjs-typed/injectable-should-be-provided`                         | error | —    |     | Exige que toda classe `@Injectable()` esteja no `providers` de algum módulo e que todo `@Controller()` esteja no `controllers` de algum módulo. Pega o erro _"Nest could not find X element"_ antes de rodar. | `src` (em uso: `<app>/src/**/*.ts`, caminho absoluto), `filterFromPaths` (em uso: `dist`, `node_modules`, `.spec.`, `.e2e-spec.`). |
| `@darraghor/nestjs-typed/provided-injected-should-match-factory-parameters`     | error | —    |     | Em `useFactory`, exige que a lista `inject: [...]` bata com os parâmetros da factory (quantidade e ordem).                                                                                                    | —                                                                                                                                  |
| `@darraghor/nestjs-typed/use-injectable-provided-token`                         | error | —    |     | Proíbe `app.get(APP_GUARD)` / `@Inject(APP_PIPE)` etc.; esses tokens globais não podem ser recuperados assim.                                                                                                 | —                                                                                                                                  |
| `@darraghor/nestjs-typed/forward-ref-injection-should-use-wrapper-type`         | error | —    |     | Com `forwardRef()`, exige tipar o parâmetro com um wrapper (ex.: `WrapperType<T>`) para evitar referência circular em runtime com ESM.                                                                        | —                                                                                                                                  |
| `@darraghor/nestjs-typed/param-decorator-name-matches-route-param`              | error | —    |     | Exige que `@Param('id')` corresponda a um parâmetro da rota (`@Get(':id')`).                                                                                                                                  | `shouldCheckController` (padrão `true`): também considera o path do `@Controller()`.                                               |
| `@darraghor/nestjs-typed/validation-pipe-should-use-forbid-unknown`             | error | —    |     | Exige `new ValidationPipe({ forbidUnknownValues: true })` (proteção contra CVE-2019-18413).                                                                                                                   | —                                                                                                                                  |
| `@darraghor/nestjs-typed/all-properties-are-whitelisted`                        | error | —    |     | Em DTOs com class-validator, exige um decorator de validação em **todas** as propriedades (senão o `whitelist` as remove silenciosamente).                                                                    | `additionalDecorators`: decorators customizados aceitos.                                                                           |
| `@darraghor/nestjs-typed/all-properties-have-explicit-defined`                  | error | —    |     | Em DTOs com class-validator, exige `@IsDefined()` ou `@IsOptional()` em toda propriedade.                                                                                                                     | `additionalDecorators`.                                                                                                            |
| `@darraghor/nestjs-typed/validated-non-primitive-property-needs-type-decorator` | error | —    |     | Propriedade de objeto/classe validada precisa de `@Type(() => Classe)` (class-transformer), senão a validação aninhada não roda.                                                                              | `additionalTypeDecorators`, `additionalCustomValidatorDecorators`.                                                                 |
| `@darraghor/nestjs-typed/validate-nested-of-array-should-set-each`              | error | —    |     | `@ValidateNested()` em array precisa de `{ each: true }`.                                                                                                                                                     | —                                                                                                                                  |
| `@darraghor/nestjs-typed/no-duplicate-decorators`                               | error | —    |     | Proíbe o mesmo decorator duas vezes na mesma classe/propriedade.                                                                                                                                              | `customList`: decorators que podem repetir.                                                                                        |
| `@darraghor/nestjs-typed/uploaded-file-should-be-validated`                     | error | —    |     | Exige validar `@UploadedFile()` com `ParseFilePipe`/`FileValidator` ou limite de tamanho do Multer.                                                                                                           | `additionalFileValidationDecorators`, `additionalFileValidationPipes`.                                                             |
| `@darraghor/nestjs-typed/api-operation-summary-description-capitalized`         | error | —    |     | Swagger: `summary`/`description` de `@ApiOperation` começam com maiúscula. Sem efeito enquanto não houver Swagger.                                                                                            | —                                                                                                                                  |
| `@darraghor/nestjs-typed/api-property-should-have-api-extra-models`             | error | —    |     | Swagger: modelos usados em `oneOf`/`allOf`/`anyOf` precisam estar em `@ApiExtraModels`. Sem efeito enquanto não houver Swagger.                                                                               | —                                                                                                                                  |

**Desligadas pelo `flatNoSwagger`** (reative removendo essa linha do `nest.mjs` ao
instalar `@nestjs/swagger`): `api-property-matches-property-optionality`,
`api-method-should-specify-api-response`, `api-method-should-specify-api-operation`,
`controllers-should-supply-api-tags`, `api-enum-property-best-practices`,
`api-property-returning-array-should-set-array`, `swagger-file-upload-should-be-documented`.

**Disponíveis mas desligadas** (opinativas; podem ser ativadas no `rh/nest/rules`):
`api-methods-should-be-guarded` (todo endpoint com `@UseGuards`),
`sort-module-metadata-arrays` 🔧 (ordena `imports`/`providers`... alfabeticamente),
`use-correct-endpoint-naming-convention` (padrão de nomes das rotas),
`use-dependency-injection` (proíbe `new Service()` onde deveria injetar).

---

## 6. Next.js: `@next/next` (core-web-vitals)

**Só no Next.** Várias regras falam de `pages/_document.js` (Pages Router); no
App Router (`src/app`) elas simplesmente não disparam.

| Regra                                                      | Nest | Next  | 🔧  | O que faz                                                                 | Opções                                       |
| ---------------------------------------------------------- | ---- | ----- | --- | ------------------------------------------------------------------------- | -------------------------------------------- |
| `@next/next/google-font-display`                           | —    | warn  |     | Exige `display` adequado ao usar Google Fonts manualmente.                | —                                            |
| `@next/next/google-font-preconnect`                        | —    | warn  |     | Exige `<link rel="preconnect">` ao usar Google Fonts manualmente.         | —                                            |
| `@next/next/inline-script-id`                              | —    | error |     | Exige `id` em `<Script>` com conteúdo inline.                             | —                                            |
| `@next/next/next-script-for-ga`                            | —    | warn  |     | Recomenda `@next/third-parties/google` para Google Analytics/Tag Manager. | —                                            |
| `@next/next/no-assign-module-variable`                     | —    | error |     | Proíbe atribuir à variável `module`.                                      | —                                            |
| `@next/next/no-async-client-component`                     | —    | warn  |     | Proíbe Client Component (`'use client'`) `async`.                         | —                                            |
| `@next/next/no-before-interactive-script-outside-document` | —    | warn  |     | Proíbe `strategy="beforeInteractive"` fora do `_document`.                | —                                            |
| `@next/next/no-css-tags`                                   | —    | warn  |     | Proíbe `<link rel="stylesheet">` manual; importe o CSS.                   | —                                            |
| `@next/next/no-document-import-in-page`                    | —    | error |     | Proíbe importar `next/document` fora do `_document`.                      | —                                            |
| `@next/next/no-duplicate-head`                             | —    | error |     | Proíbe `<Head>` duplicado no `_document`.                                 | —                                            |
| `@next/next/no-head-element`                               | —    | warn  |     | Proíbe `<head>` cru (Pages Router); use `next/head` ou `metadata`.        | —                                            |
| `@next/next/no-head-import-in-document`                    | —    | error |     | Proíbe `next/head` dentro do `_document`.                                 | —                                            |
| `@next/next/no-html-link-for-pages`                        | —    | error |     | Proíbe `<a href="/rota">` para páginas internas; use `<Link>`.            | Aceita a pasta de páginas (string ou array). |
| `@next/next/no-img-element`                                | —    | warn  |     | Proíbe `<img>`; use `<Image>` de `next/image` (otimização/LCP).           | —                                            |
| `@next/next/no-location-assign-relative-destination`       | —    | warn  |     | Proíbe `location.href = '/rota'` para rotas internas; use o router.       | —                                            |
| `@next/next/no-page-custom-font`                           | —    | warn  |     | Proíbe fontes customizadas carregadas só numa página.                     | —                                            |
| `@next/next/no-script-component-in-head`                   | —    | error |     | Proíbe `<Script>` dentro de `<Head>`.                                     | —                                            |
| `@next/next/no-styled-jsx-in-document`                     | —    | warn  |     | Proíbe `styled-jsx` no `_document`.                                       | —                                            |
| `@next/next/no-sync-scripts`                               | —    | error |     | Proíbe `<script src>` síncrono; use `<Script>`.                           | —                                            |
| `@next/next/no-title-in-document-head`                     | —    | warn  |     | Proíbe `<title>` no `Head` do `_document`.                                | —                                            |
| `@next/next/no-typos`                                      | —    | warn  |     | Detecta erros de digitação em `getStaticProps`, `getServerSideProps` etc. | —                                            |
| `@next/next/no-unwanted-polyfillio`                        | —    | warn  |     | Proíbe polyfills do Polyfill.io que o Next já inclui.                     | —                                            |

---

## 7. React: `eslint-plugin-react`

**Só no Next.**

| Regra                            | Nest | Next  | 🔧  | O que faz                                                             | Opções                                                                    |
| -------------------------------- | ---- | ----- | --- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `react/display-name`             | —    | error |     | Exige `displayName` em componentes sem nome (ex.: `memo(() => ...)`). | `ignoreTranspilerName`, `checkContextObjects`.                            |
| `react/jsx-key`                  | —    | error |     | Exige `key` em itens de `.map()` e arrays de JSX.                     | `checkFragmentShorthand`, `checkKeyMustBeforeSpread`, `warnOnDuplicates`. |
| `react/jsx-no-comment-textnodes` | —    | error |     | Proíbe `// comentário` solto no JSX (vira texto na tela).             | —                                                                         |
| `react/jsx-no-duplicate-props`   | —    | error |     | Proíbe a mesma prop duas vezes (`<A x x />`).                         | `ignoreCase`.                                                             |
| `react/jsx-no-undef`             | —    | error |     | Proíbe usar componente não importado/declarado.                       | `allowGlobals`.                                                           |
| `react/jsx-uses-react`           | —    | error |     | Marca `React` como usado quando há JSX (evita falso "não usado").     | —                                                                         |
| `react/jsx-uses-vars`            | —    | error |     | Marca componentes usados no JSX como usados.                          | —                                                                         |
| `react/no-children-prop`         | —    | error |     | Proíbe passar `children` como prop; use aninhamento.                  | `allowFunctions`.                                                         |
| `react/no-danger-with-children`  | —    | error |     | Proíbe `children` junto com `dangerouslySetInnerHTML`.                | —                                                                         |
| `react/no-deprecated`            | —    | error |     | Proíbe APIs depreciadas do React.                                     | —                                                                         |
| `react/no-direct-mutation-state` | —    | error |     | Proíbe `this.state.x = ...` (componentes de classe).                  | —                                                                         |
| `react/no-find-dom-node`         | —    | error |     | Proíbe `findDOMNode`.                                                 | —                                                                         |
| `react/no-is-mounted`            | —    | error |     | Proíbe `isMounted()`.                                                 | —                                                                         |
| `react/no-render-return-value`   | —    | error |     | Proíbe usar o retorno de `ReactDOM.render`.                           | —                                                                         |
| `react/no-string-refs`           | —    | error |     | Proíbe `ref="nome"`; use `useRef`.                                    | `noTemplateLiterals`.                                                     |
| `react/no-unescaped-entities`    | —    | error |     | Proíbe `'`, `"`, `>` e `}` crus no texto JSX; use `&apos;` etc.       | `forbid` (lista de caracteres).                                           |
| `react/require-render-return`    | —    | error |     | Exige `return` no `render()` de componentes de classe.                | —                                                                         |

---

## 8. React Hooks e React Compiler: `eslint-plugin-react-hooks` v7

**Só no Next.** Além das duas regras clássicas (`rules-of-hooks` e `exhaustive-deps`),
a v7 traz as regras do **React Compiler**, que verificam se o componente é "puro".

| Regra                                     | Nest | Next  | 🔧  | O que faz                                                                                                 | Opções                                                                                                                           |
| ----------------------------------------- | ---- | ----- | --- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `react-hooks/rules-of-hooks`              | —    | error |     | **Regras dos Hooks**: só chamar hooks no topo de componentes/hooks (nunca em `if`, loop ou função comum). | `additionalHooks`.                                                                                                               |
| `react-hooks/exhaustive-deps`             | —    | warn  | 🔧  | Confere se o array de dependências de `useEffect`/`useMemo`/`useCallback` está completo.                  | `additionalHooks` (regex de hooks customizados), `requireExplicitEffectDeps`, `enableDangerousAutofixThisMayCauseInfiniteLoops`. |
| `react-hooks/config`                      | —    | error |     | Valida as opções de configuração do React Compiler.                                                       | —                                                                                                                                |
| `react-hooks/error-boundaries`            | —    | error |     | Exige Error Boundary em vez de `try/catch` para erros de componentes filhos.                              | —                                                                                                                                |
| `react-hooks/gating`                      | —    | error |     | Valida a configuração do modo _gating_ do Compiler.                                                       | —                                                                                                                                |
| `react-hooks/globals`                     | —    | error |     | Proíbe alterar variáveis globais durante o render.                                                        | —                                                                                                                                |
| `react-hooks/immutability`                | —    | error |     | Proíbe mutar props, state e outros valores imutáveis.                                                     | —                                                                                                                                |
| `react-hooks/incompatible-library`        | —    | warn  |     | Avisa sobre bibliotecas incompatíveis com memoização.                                                     | —                                                                                                                                |
| `react-hooks/preserve-manual-memoization` | —    | error |     | Garante que `useMemo`/`useCallback` manuais continuam válidos para o Compiler.                            | —                                                                                                                                |
| `react-hooks/purity`                      | —    | error |     | Proíbe chamar funções impuras no render (`Math.random()`, `Date.now()`).                                  | —                                                                                                                                |
| `react-hooks/refs`                        | —    | error |     | Proíbe ler/escrever `ref.current` durante o render.                                                       | —                                                                                                                                |
| `react-hooks/set-state-in-effect`         | —    | error |     | Proíbe `setState` síncrono dentro de `useEffect` (geralmente é estado derivado).                          | —                                                                                                                                |
| `react-hooks/set-state-in-render`         | —    | error |     | Proíbe `setState` durante o render (loop infinito).                                                       | —                                                                                                                                |
| `react-hooks/static-components`           | —    | error |     | Proíbe declarar componentes dentro de outros componentes (são recriados a cada render).                   | —                                                                                                                                |
| `react-hooks/unsupported-syntax`          | —    | warn  |     | Avisa sobre sintaxe que o React Compiler não suporta (`eval`, `with`).                                    | —                                                                                                                                |
| `react-hooks/use-memo`                    | —    | error |     | Valida o uso de `useMemo` (ex.: callback precisa retornar valor).                                         | —                                                                                                                                |

---

## 9. Acessibilidade: `eslint-plugin-jsx-a11y`

**Só no Next.** O `eslint-config-next` ativa apenas um subconjunto, todo como `warn`.

| Regra                                   | Nest | Next | 🔧  | O que faz                                                                                    | Opções                                                                                                |
| --------------------------------------- | ---- | ---- | --- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `jsx-a11y/alt-text`                     | —    | warn |     | Exige `alt` em `<img>` e `<Image>`.                                                          | `elements` (em uso: `["img"]`), `img` (em uso: `["Image"]`), `object`, `area`, `input[type="image"]`. |
| `jsx-a11y/aria-props`                   | —    | warn |     | Exige que atributos `aria-*` existam (sem erro de digitação).                                | —                                                                                                     |
| `jsx-a11y/aria-proptypes`               | —    | warn |     | Exige valores válidos em `aria-*` (`aria-hidden="true"`).                                    | —                                                                                                     |
| `jsx-a11y/aria-unsupported-elements`    | —    | warn |     | Proíbe `aria-*`/`role` em elementos que não suportam (`<meta>`, `<script>`).                 | —                                                                                                     |
| `jsx-a11y/role-has-required-aria-props` | —    | warn |     | Exige os `aria-*` obrigatórios do `role` (ex.: `role="checkbox"` precisa de `aria-checked`). | —                                                                                                     |
| `jsx-a11y/role-supports-aria-props`     | —    | warn |     | Proíbe `aria-*` que o `role` do elemento não suporta.                                        | —                                                                                                     |

---

## 10. Imports: `eslint-plugin-import`

**Só no Next.**

| Regra                                | Nest | Next | 🔧  | O que faz                                                                                     | Opções                                                                                                                                                                 |
| ------------------------------------ | ---- | ---- | --- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `import/no-anonymous-default-export` | —    | warn |     | Proíbe `export default () => {}` e `export default {}` anônimos (piora debug e Fast Refresh). | `allowArrowFunction`, `allowAnonymousFunction`, `allowAnonymousClass`, `allowObject`, `allowArray`, `allowLiteral`, `allowCallExpression`, `allowNew` (todas `false`). |

---

## Regras desligadas pelo Prettier

O `eslint-config-prettier` vem **por último** em todos os presets e desliga as
regras de **estilo** (indentação, aspas, ponto e vírgula, vírgula final...). Quem
cuida disso é o Prettier (`.prettierrc` na raiz). Não reative essas regras no ESLint,
porque as duas ferramentas vão brigar entre si.
