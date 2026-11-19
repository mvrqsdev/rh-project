import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.enableCors();
  app.set('trust proxy', 1);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
