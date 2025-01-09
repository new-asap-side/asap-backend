import { Test, TestingModule } from '@nestjs/testing';
import { FcmService } from '@src/fcm/fcm.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApnService } from '@src/apn/apn.service';
import { ApnConfig } from '@src/apn/apn.config';
import { HttpModule } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken';

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

  it('jwt test', ()=> {
    const result = apnService.generateJWT()
    console.log(result)
  })

  it('send apns', async () => {
    const deviceToken = 'a5058f221e9b0940b23e80dd8a2515d8cdb2ffd9700e5afa8fec8e857c3a2664'
    const result = await apnService.sendNotification(deviceToken, 1)
    console.log(result)
  });

  it('send apnsV2', async () => {
    // const deviceToken = 'a5058f221e9b0940b23e80dd8a2515d8cdb2ffd9700e5afa8fec8e857c3a2664'
    // const result = await apnService.sendNotificationV2(deviceToken)
    // console.log(result)
  });
});
