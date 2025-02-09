import { Test, TestingModule } from '@nestjs/testing';
import { FcmService } from '@src/alarm/fcm/fcm.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApnService } from '@src/alarm/apn/apn.service';
import { ApnConfig } from '@src/alarm/apn/apn.config';
import { HttpModule } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken';
import { AlarmTypeEnum } from '@src/database/entity/userGroup';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';

describe('ApnService Test', () => {
  let apnService: ApnService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
      ],
      providers: [ApnService, ConfigService, ApnConfig],
    }).compile();

    apnService = app.get<ApnService>(ApnService);
    configService = app.get<ConfigService>(ConfigService);
  });


  it('send apnsV2', async () => {
    const deviceToken = '0318b27df2a878db64590848e5bcedf98f132d4864a3a3b1e173d502bd0f7e53'
    const alarmPayload = {
      group_id: '1',
      group_title: 'string',
      music_title: 'string',
      alarm_type: AlarmTypeEnum.vibration,
      music_volume: '10',
      alarm_unlock_contents: AlarmUnlockContentsEnum.slide
    }
    const result = await apnService.sendNotificationV2(deviceToken, alarmPayload)
    console.log(result)
  });
});
