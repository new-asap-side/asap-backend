// alarm.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateAlarmDateDto } from '@src/dto/dto.group';
import { FcmService } from '@src/fcm/fcm.service';

@Processor('alarmQueue')
export class AlarmProcessor {
  constructor(private readonly fcmService: FcmService) {}

  @Process('sendAlarm')
  async handleAlarmJob(job: Job) {
    const triggerDate: CreateAlarmDateDto = job.data;
    const fcmToken = job.data
    const message = `알람이 울립니다: ${triggerDate.alarm_day} ${triggerDate.alarm_time}`;

    await this.fcmService.sendNotificationToTopic(fcmToken, message);
  }
}
