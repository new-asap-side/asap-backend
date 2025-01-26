import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { FcmService } from '@src/fcm/fcm.service';
import { ApnService } from '@src/apn/apn.service';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';
import { AlarmTypeEnum } from '@src/database/entity/userGroup';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let apnService: ApnService
  let fcmService: FcmService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FcmService, ApnService]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    apnService = app.get<ApnService>(ApnService)
    fcmService = app.get<FcmService>(FcmService)
  });

  it('ios apn', async () => {
    // const deviceToken = ''
    // await apnService.sendNotificationV2(deviceToken, 1)
  });

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
  });
});
