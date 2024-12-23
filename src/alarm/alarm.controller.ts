import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { AlarmService } from '@src/alarm/alarm.service';
import { AlarmOffRequest, AlarmOffResponse } from '@src/dto/dto.alarm';
import { AlarmQueueService } from '@src/alarm/alarm.queue.service';

@ApiTags('alarm')
@Controller('alarm')
@UseGuards(JwtAuthGuard)
export class AlarmController {
  constructor(
    private readonly alarmQueueService: AlarmQueueService
  ) {}

  @Post('off')
  @ApiOperation({summary: '알람 해제'})
  @ApiResponse({ status: 200, type: AlarmOffResponse })
  async getAllGroup(req: AlarmOffRequest) {
    await this.alarmQueueService.emitAlarmOff(req.userId, req.groupId)
    return {result: true}
  }


}