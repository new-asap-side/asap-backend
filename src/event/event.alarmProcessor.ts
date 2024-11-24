// alarm.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateAlarmDateDto } from '@src/dto/dto.group';
import { FcmService } from '@src/fcm/fcm.service';
import dayjs from 'dayjs';
import { AlarmUnlockContentsEnum } from '@src/database/entity/userGroup';
import { ApnService } from '@src/apn/apn.service';

@Processor('alarmQueue')
export class AlarmProcessor {
  constructor(
    private readonly fcmService: FcmService,
  ) {}

  @Process('sendAlarm')
  async handleAlarmJob(job: Job) {
    const { fcmToken, alarm_unlock_contents }: {fcmToken: string, alarm_unlock_contents: AlarmUnlockContentsEnum} = job.data

    await this.fcmService.sendNotificationToTopic(fcmToken, alarm_unlock_contents);
  }
}

@Processor('iosAlarmQueue')
export class IosAlarmProcessor {
  constructor(
    private readonly apnService: ApnService,
  ) {}

  @Process('sendIosAlarm')
  async handleIosAlarmJob(job: Job) {
    const { deviceToken, payload }: {deviceToken: string, payload: InotificationPayload} = job.data

    await this.apnService.sendNotification(deviceToken, payload);
  }
}


