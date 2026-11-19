// Valida a mensagem de commit no padrão Conventional Commits.
// Formato: <tipo>(<escopo opcional>): <descrição>
//   feat(server): adiciona módulo de candidatos
//   fix(web): corrige layout do formulário
// Tipos e regras: https://www.conventionalcommits.org/pt-br
/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Escopos sugeridos (só AVISA se usar outro; o escopo é opcional).
    'scope-enum': [
      1,
      'always',
      ['server', 'web', 'mobile', 'eslint-config', 'deps', 'ci', 'repo'],
    ],
  },
};
