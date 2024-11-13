// alarm.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateAlarmDateDto } from '@src/dto/dto.group';
import { FcmService } from '@src/fcm/fcm.service';
import dayjs from 'dayjs';

@Processor('alarmQueue')
export class AlarmProcessor {
  constructor(private readonly fcmService: FcmService) {}

  @Process('sendAlarm')
  async handleAlarmJob(job: Job) {
    const fcmToken = job.data
    const message = `알람이 울립니다!`;

    await this.fcmService.sendNotificationToTopic(fcmToken, message);
  }
}
