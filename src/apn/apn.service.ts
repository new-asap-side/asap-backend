import { Injectable } from '@nestjs/common';
import { ApnConfig } from '@src/apn/apn.config';
import * as jwt from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import apn from 'apn';
import { AlarmPayload } from '@src/dto/dto.fcm_apns';

@Injectable()
export class ApnService {
  constructor(
    private apnConfig: ApnConfig,
    private readonly httpService: HttpService
  ) {
  }

  async sendNotificationV2(deviceToken: string, alarmPayload: AlarmPayload): Promise<void> {
    const options = this.apnConfig.getOption()
    console.log('options: ', options)
    const apnProvider = new apn.Provider(options);
    console.log('apnProvider: ', apnProvider)

    const notification = new apn.Notification({
      aps: {
        'content-available': 1,
      },
      payload: {
        ...alarmPayload
      },
      pushType: 'background',
      priority: 5,
      topic: 'com.asap.Aljyo'
    });

    try {
      const result = await apnProvider.send(notification, deviceToken);
      console.log('APNs result:', result.failed[0].response);
    } catch (err) {
      console.error('APNs error:', err);
    } finally {
      apnProvider.shutdown();
    }
  }
}
