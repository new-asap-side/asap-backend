import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApnConfig {
  constructor(private configService: ConfigService) {}

  getApnConfig() {
    return {
      token: {
        key: this.configService.get<string>('APNS_P8_FILE_STRING'), // p8 파일 경로
        keyId: this.configService.get<string>('APNS_KEY_ID'), // Key ID
        teamId: this.configService.get<string>('APNS_TEAM_ID'), // Team ID
      },
      production: this.configService.get<boolean>('APNS_PRODUCTION', false), // 기본값 false
    };
  }

  getAppBundleId() {
    return this.configService.get<string>('APNS_BUNDLE_ID'); // App의 Bundle ID
  }
}
