import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
      // Nos testes, as variáveis vêm de test/setup-env.ts, nunca do .env local.
      ignoreEnvFile: process.env.NODE_ENV === 'test',
    }),
    EnvModule,
    HttpModule,
  ],
})
export class AppModule {}
