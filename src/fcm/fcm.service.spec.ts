import { Test, TestingModule } from '@nestjs/testing';
import { FcmService } from '@src/fcm/fcm.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlarmTypeEnum } from '@src/database/entity/userGroup';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';
import { ApnService } from '@src/apn/apn.service';
import { ApnModule } from '@src/apn/apn.module';

describe('FcmService Test', () => {
  let fcmService: FcmService;
  let apnService: ApnService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ApnModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
      ],
      providers: [FcmService, ConfigService],
    }).compile();

    fcmService = app.get<FcmService>(FcmService);
    apnService = app.get<ApnService>(ApnService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('fcm messaging', () => {
    // it('send test', async ()=> {
    //   // const result = await fcmService.sendMessage()
    //   const result = configService.get('FIRE_BASE_CONFIG')
    //   console.log(result)
    // })

    it('android fcm', async () => {
    const fcmToken = 'fGdr0tVuSf2iQuDd5Cq6dN:APA91bGAO_YjVePcD-jRqK0B63fdDYhyeW_ZkT1kjaJxKwgizCNqdUPLwxTz4SQWn5hay0esu3BZnJxl6DhC-dqg2mo_usu4CtiF8C0oscd0BaBALqN8bOA'
    const alarm_unlock_contents = {
      group_id: '1',
      group_title: 'group_title',
      music_title: 'music_title',
      alarm_type: AlarmTypeEnum.vibration,
      music_volume: '10',
      alarm_unlock_contents: AlarmUnlockContentsEnum.slide
    }
    await fcmService.sendNotificationToTopic(fcmToken, alarm_unlock_contents)
    await fcmService.sendNotificationToTopic(fcmToken, alarm_unlock_contents)
  });

    it('ios apns', async () => {
    const Token = 'c1779b5b4045a8744b1125913738cb1cfeadef060ed098197f88f37bc2a3b01a'
    const alarm_unlock_contents = {
      group_id: '1',
      group_title: 'group_title',
      music_title: 'music_title',
      alarm_type: AlarmTypeEnum.vibration,
      music_volume: '10',
      alarm_unlock_contents: AlarmUnlockContentsEnum.slide
    }
    await apnService.sendNotificationV2(Token, alarm_unlock_contents)
    await apnService.sendNotificationV2(Token, alarm_unlock_contents)
  });
  });
});
