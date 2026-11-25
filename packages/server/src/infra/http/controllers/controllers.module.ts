import { Module } from '@nestjs/common';
import { EnvModule } from '../../env/env.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [EnvModule],
  controllers: [HealthController],
})
export class ControllersModule {}
