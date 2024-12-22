import { Injectable } from '@nestjs/common';
import { ApnConfig } from '@src/apn/apn.config';
import jwt from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class ApnService {
  constructor(
    private apnConfig: ApnConfig,
    private readonly httpService: HttpService
  ) {
  }

  private generateJWT() {
    const header = {
      alg: 'ES256',
      kid: '7W7779L8K6',
    };

    const payload = {
      iss: 'ZP2P7SHATC', // Team ID
      iat: Math.floor(Date.now() / 1000), // 현재 UTC 시간 (초 단위)
    };

    // p8 키 읽기
    const privateKey = this.apnConfig.getApnConfig().APNS_P8_FILE_STRING
    console.log(`privateKey: ${privateKey}`)

    // JWT 생성
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'ES256',
      header,
    });

    return token
  }

  async sendNotification(deviceToken: string): Promise<void> {
    // JWT 헤더와 페이로드
    const APNS_URL = `https://api.push.apple.com/3/device`
    const token = this.generateJWT()
    console.log('Bearer Token:', token);


    const body = JSON.stringify({
      aps: { "content-available" : 1 },
      'hi': 'Hello'
    })
    const contentLength = Buffer.byteLength(body, 'utf-8');

    const headers = {
      Host: 'api.push.apple.com',
      Authorization: `bearer ${token}`,
      'apns-push-type': 'background',
      'apns-expiration': '0',
      'apns-priority': '5',
      'apns-topic': 'com.asap.Aljyo',
      'Content-Length': contentLength.toString(),
    };

    const url = `${APNS_URL}/${deviceToken}`;

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('APN raw Error: ',JSON.stringify(error))
      // console.error('APNs Request Error:', error.response?.data || error.message);
      throw new Error('Failed to send push notification');
    }
  }
}
