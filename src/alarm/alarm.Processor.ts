import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FcmService } from '@src/fcm/fcm.service';
import { ApnService } from '@src/apn/apn.service';
import { AlarmService } from '@src/alarm/alarm.service';
import { AlarmPayload } from '@src/dto/dto.fcm_apns';
import { AlarmActionQueueEnum, AndroidQueueEnum, IosQueueEnum } from '@src/database/enum/queueEnum';

@Processor(AndroidQueueEnum.NAME)
export class AndroidAlarmProcessor {
  constructor(
    private readonly fcmService: FcmService,
  ) {}

  @Process(AndroidQueueEnum.SEND)
  async handleAlarmJob(job: Job) {
    const { fcmToken, alarmPayload }: {fcmToken: string, alarmPayload: AlarmPayload} = job.data

    await this.fcmService.sendNotificationToTopic(fcmToken, alarmPayload);
  }
}

@Processor(IosQueueEnum.NAME)
export class IosAlarmProcessor {
  constructor(
    private readonly apnService: ApnService,
  ) {}

  @Process(IosQueueEnum.SEND)
  async handleIosAlarmJob(job: Job) {
    const { deviceToken, alarmPayload }: {deviceToken: string, alarmPayload: AlarmPayload} = job.data

    await this.apnService.sendNotificationV2(deviceToken, alarmPayload);
  }
}

@Processor(AlarmActionQueueEnum.NAME)
export class AlarmProcessor {
  constructor(
    private readonly alarmService: AlarmService,
  ) {
  }

  @Process(AlarmActionQueueEnum.OFF)
  async handleOffAlarmJob(job: Job) {
    const { userId, groupId }: { userId: number, groupId: number } = job.data
    await this.alarmService.offAlarm(userId, groupId);
  }
}

