import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as apn from 'apn';
import { ApnConfig } from '@src/apn/apn.config';

@Injectable()
export class ApnService {
  private apnProvider: apn.Provider;
  private appBundleId: string;
  private static initialized = false;

  constructor(private apnConfig: ApnConfig) {
    if(!ApnService.initialized) {
      const config = this.apnConfig.getApnConfig();
      this.apnProvider = new apn.Provider(config);
      this.appBundleId = this.apnConfig.getAppBundleId();

      ApnService.initialized = true;  // 초기화가 완료된 후, initialized 플래그를 true로 설정
    }
  }

  async sendNotification(deviceToken: string, payload: InotificationPayload): Promise<void> {
    const notification = new apn.Notification();

    // 알림 내용 설정
    notification.alert = payload.alert || 'Default Alert Message';
    notification.badge = payload.badge || 1;
    notification.sound = payload.sound || 'default';
    notification.topic = this.appBundleId; // App의 Bundle ID

    try {
      const result = await this.apnProvider.send(notification, deviceToken);
      console.log('APNs result:', result);
      if (result.failed.length > 0) {
        console.error('Failed notifications:', result.failed);
      }
    } catch (error) {
      console.error('Error sending APNs notification:', error);
    }
  }
}
