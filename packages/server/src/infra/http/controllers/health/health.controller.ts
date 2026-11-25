import { Controller, Get } from '@nestjs/common';
import { HealthPresenter } from '../../presenters/health/health.presenter';

@Controller('/health')
export class HealthController {
  @Get()
  check() {
    return HealthPresenter.toHTTP();
  }
}
