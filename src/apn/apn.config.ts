import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApnConfig {
  constructor(private configService: ConfigService) {}

  get() {
    return {
        APNS_P8_FILE_STRING: this.configService.get<string>('APNS_P8_FILE_STRING'), // p8 파일
      }
    }

  getOption() {
    return {
      token: {
        key: this.configService.get<string>('APNS_P8_FILE_STRING').trim(),
        keyId: this.configService.get<string>('APNS_KEY_ID'),
        teamId: this.configService.get<string>('APNS_TEAM_ID')
      },
      production: this.configService.get<boolean>('APNS_PRODUCTION')
    }
  }

}
