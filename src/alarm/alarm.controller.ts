import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '@src/auth/auth.guard';
import { AlarmOffRateResponse, AlarmOffRequest, AlarmOffResponse } from '@src/dto/dto.alarm';
import { AlarmQueueService } from '@src/alarm/alarm.queue.service';
import { AlarmService } from '@src/alarm/alarm.service';

@ApiTags('alarm')
@Controller('alarm')
@UseGuards(JwtAccessGuard)
export class AlarmController {
  constructor(
    private readonly alarmQueueService: AlarmQueueService,
    private readonly alarmService: AlarmService
  ) {}

  @Post('off')
  @ApiOperation({summary: '알람 해제'})
  @ApiResponse({ status: 200, type: AlarmOffResponse })
  async alarmOff(
    @Body() req: AlarmOffRequest
  ) {
    await this.alarmQueueService.emitAlarmOff(req.userId, req.groupId)
    return {result: true}
  }

  @Get('off-rate/:user_id')
  @ApiOperation({summary: '알람 해제율'})
  @ApiResponse({status: 200, type: AlarmOffRateResponse})
  async getAlarmOffRate(
    @Param('user_id') userId: string
  ) {
    return await this.alarmService.getUserAlarmUnlockRate(Number(userId))
  }

}