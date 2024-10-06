import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,

  ) {}

  @Get('health')
  @ApiOperation({summary: '서버 헬스 체크'})
  getHealth(): string {
    return this.appService.getHealth();
  }
}
