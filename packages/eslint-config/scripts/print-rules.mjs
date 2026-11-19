// Lista as regras EFETIVAS (já com overrides) que o ESLint aplica a um arquivo.
// Uso (da raiz do monorepo):
//   npm run rules -w @rh/eslint-config -- packages/server src/main.ts
//   npm run rules -w @rh/eslint-config -- packages/web src/app/page.tsx
// Saída: tabela markdown "regra | severidade | opções | descrição (inglês)".
import { ESLint } from 'eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../..');
const [appDir, file] = process.argv.slice(2);
if (!appDir || !file) {
  console.error(
    'Uso: print-rules.mjs <pasta-do-app> <arquivo-relativo-ao-app>',
  );
  process.exit(1);
}

const cwd = path.resolve(root, appDir);
const config = await new ESLint({ cwd }).calculateConfigForFile(file);
const names = { 0: 'off', 1: 'warn', 2: 'error' };

const rows = Object.entries(config.rules)
  .map(([name, value]) => {
    const [severity, ...options] = Array.isArray(value) ? value : [value];
    const i = name.lastIndexOf('/');
    const meta =
      i === -1
        ? builtinRules.get(name)?.meta
        : config.plugins[name.slice(0, i)]?.rules?.[name.slice(i + 1)]?.meta;
    return {
      name,
      severity: names[severity] ?? severity,
      options: options.length ? JSON.stringify(options) : '',
      description: meta?.docs?.description ?? '',
    };
  })
  .filter((r) => r.severity !== 'off')
  .sort((a, b) => a.name.localeCompare(b.name));

console.log(`<!-- ${rows.length} regras ativas em ${appDir}/${file} -->`);
console.log('| Regra | Severidade | Opções | Descrição |');
console.log('|---|---|---|---|');
for (const r of rows) {
  console.log(
    `| \`${r.name}\` | ${r.severity} | ${r.options && `\`${r.options}\``} | ${r.description.replaceAll('|', '\\|')} |`,
  );
}
