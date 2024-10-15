import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(

  ) {}

  @Get('health')
  @ApiOperation({summary: '서버 헬스 체크'})
  getHealth(): string {
    return 'health'
  }

}
