import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FcmService } from '@src/fcm/fcm.service';
import { ApnService } from '@src/apn/apn.service';
import { AlarmService } from '@src/alarm/alarm.service';
import { AlarmPayload } from '@src/dto/dto.fcm_apns';

@Processor('androidAlarmQueue')
export class AndroidAlarmProcessor {
  constructor(
    private readonly fcmService: FcmService,
  ) {}

  @Process('sendAlarm')
  async handleAlarmJob(job: Job) {
    const { fcmToken, alarmPayload }: {fcmToken: string, alarmPayload: AlarmPayload} = job.data

    await this.fcmService.sendNotificationToTopic(fcmToken, alarmPayload);
  }
}

@Processor('iosAlarmQueue')
export class IosAlarmProcessor {
  constructor(
    private readonly apnService: ApnService,
  ) {}

  @Process('sendIosAlarm')
  async handleIosAlarmJob(job: Job) {
    const { deviceToken, alarmPayload }: {deviceToken: string, alarmPayload: AlarmPayload} = job.data

    await this.apnService.sendNotificationV2(deviceToken, alarmPayload);
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

