import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApnConfig {
  constructor(private configService: ConfigService) {}

  getOption() {
    return {
      token: {
        key: this.configService.get<string>('APNS_P8_FILE_STRING').trim(),
        keyId: this.configService.get<string>('APNS_KEY_ID'),
        teamId: this.configService.get<string>('APNS_TEAM_ID')
      },
      production: this.convert()
    }
  }

  convert() {
    const isProduction = this.configService.get('APNS_PRODUCTION')
    if(isProduction === 'false') return false
    else if(isProduction === 'true')return true
    else return true
  }

}
