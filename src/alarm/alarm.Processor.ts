// alarm.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateAlarmDateDto } from '@src/dto/dto.group';
import { FcmService } from '@src/fcm/fcm.service';
import dayjs from 'dayjs';
import { ApnService } from '@src/apn/apn.service';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';
import { AlarmService } from '@src/alarm/alarm.service';

@Processor('androidAlarmQueue')
export class AndroidAlarmProcessor {
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

    await this.apnService.sendNotificationV2(deviceToken);
  }
}

  @Processor('AlarmQueue')
  export class AlarmProcessor {
    constructor(
      private readonly alarmService: AlarmService,
    ) {
    }

    @Process('offAlarm')
    async handleOffAlarmJob(job: Job) {
      const { userId, groupId }: { userId: number, groupId: number } = job.data
      await this.alarmService.offAlarm(userId, groupId);
    }
  }

