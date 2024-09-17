import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './comman/decorators/public.decorator';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('healthcheck')
  healthcheck() {
    return this.appService.getHello();
  }
}
