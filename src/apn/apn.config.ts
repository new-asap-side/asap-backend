import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApnConfig {
  constructor(private configService: ConfigService) {}

  getApnConfig() {
    return {
        APNS_P8_FILE_STRING: this.configService.get<string>('APNS_P8_FILE_STRING'), // p8 파일
      }
    }
}
