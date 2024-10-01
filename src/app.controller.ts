import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,

  ) {}

  @Get()
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Get()
  getTest(): string {
    return this.appService.getTest();
  }
}
