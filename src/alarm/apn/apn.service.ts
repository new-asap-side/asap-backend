import { Injectable } from '@nestjs/common';
import { ApnConfig } from '@src/alarm/apn/apn.config';
import apn from 'apn';
import { AlarmPayload } from '@src/libs/dto/dto.fcm_apns';

@Injectable()
export class ApnService {
  constructor(
    private apnConfig: ApnConfig,
  ) {
  }

  async sendNotificationV2(deviceToken: string, alarmPayload: AlarmPayload): Promise<void> {
    const options = this.apnConfig.getOption()
    console.log('is production apns: ', options.production)
    const apnProvider = new apn.Provider(options);

    const notification = new apn.Notification({
      aps: { 'content-available': 1 },
      payload: { ...alarmPayload },
      pushType: 'background',
      priority: 5,
      topic: 'com.asap.Aljyo'
    });

    try {
      const result = await apnProvider.send(notification, deviceToken);
      console.log('APNs result:', result);
    } catch (err) {
      console.error('APNs error:', err);
    } finally {
      apnProvider.shutdown();
    }
  }
}
