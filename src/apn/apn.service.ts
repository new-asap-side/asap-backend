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

  public generateJWT() {
    const header = {
      alg: 'ES256',
      kid: '7W7779L8K6',
    };

    const payload = {
      iss: 'ZP2P7SHATC', // Team ID
      iat: Math.floor(Date.now() / 1000), // 현재 UTC 시간 (초 단위)
    };

    // p8 키 읽기
    const privateKey = this.apnConfig.get()
      .APNS_P8_FILE_STRING

    // JWT 생성
    const token = jwt.sign(
      payload,
      privateKey,
      { algorithm: 'ES256', header }
    );
    console.log(`APN token: ${token}`)

    return token
  }

  async sendNotification(deviceToken: string, group_id: number): Promise<void> {
    // JWT 헤더와 페이로드
    const APNS_URL = `https://api.sandbox.push.apple.com/3/device`
    const token = this.generateJWT()
    console.log('Bearer Token:', token);

    const body = {
      aps: { "content-available" : 1 },
      group_id
    }

    const headers = {
      Host: 'api.sandbox.push.apple.com',
      Authorization: `bearer ${token}`,
      'apns-push-type': 'background',
      'apns-expiration': '0',
      'apns-priority': '5',
      'apns-topic': 'com.asap.Aljyo',
    };

    const url = `${APNS_URL}/${deviceToken}`;
    console.log(`url: ${url}`)

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('APN raw Error: ',JSON.stringify(error))
      throw new Error('Failed to send push notification');
    }
  }

  async sendNotificationV2(deviceToken: string, alarmPayload: AlarmPayload): Promise<void> {
    const options = this.apnConfig.getOption()

    const apnProvider = new apn.Provider(options);

    const notification = new apn.Notification({
      aps: {
        'content-available': 1,
      },
      ...alarmPayload,
      pushType: 'background',
      priority: 5
    });

    // 앱의 bundle id
    notification.topic = 'com.asap.Aljyo';

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
