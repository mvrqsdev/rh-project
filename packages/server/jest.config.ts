import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

// Path aliases (e.g. the ones added by `nest g library`) live in tsconfig.json,
// so they are read from there instead of being duplicated here.
const { config: tsconfig } = ts.readConfigFile(
  './tsconfig.json',
  ts.sys.readFile,
);
const paths = tsconfig?.compilerOptions?.paths ?? {};

// Configuração comum aos projetos `unit` e `e2e`.
const shared = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  testEnvironment: 'node',
} satisfies Config;

// Unit e e2e ficam no mesmo arquivo como `projects`; escolha qual roda com
// `jest --selectProjects unit` ou `jest --selectProjects e2e`.
// Sem filtro, roda os dois (usado pelo `test:cov`).
const config: Config = {
  projects: [
    {
      ...shared,
      displayName: 'unit',
      testRegex: 'src/.*\\.spec\\.ts$',
    },
    {
      ...shared,
      displayName: 'e2e',
      testRegex: 'test/.*\\.e2e-spec\\.ts$',
    },
  ],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
    'apps/**/*.(t|j)s',
    // Bootstrap do servidor: não é exercitado pelos testes.
    '!src/infra/main.ts',
  ],
  coverageDirectory: './coverage',
};

export default config;
