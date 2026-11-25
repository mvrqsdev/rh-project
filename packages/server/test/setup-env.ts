// Carregado pelo Jest (`setupFiles`) antes de cada arquivo de teste.
// Os testes não leem o `.env` local (ver `ignoreEnvFile` no AppModule):
// tudo que o `envSchema` exige precisa ser definido aqui.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
