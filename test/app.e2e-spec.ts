import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { FcmService } from '@src/fcm/fcm.service';
import { ApnService } from '@src/apn/apn.service';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';

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

  it('should ', () => {
    const result = apnService.generateJWT()
    console.log(result)
  });

  it('ios apn', async () => {
    const deviceToken = ''

    await apnService.sendNotification(deviceToken, 1)
  });

  it('android fcm', async () => {
    // const fcmToken = ''
    // const alarm_unlock_contents = AlarmUnlockContentsEnum.card
    // await fcmService.sendNotificationToTopic(fcmToken, alarm_unlock_contents)
  });
});
