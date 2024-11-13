import { Test, TestingModule } from '@nestjs/testing';
import { FcmService } from '@src/fcm/fcm.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('FcmService Test', () => {
  let fcmService: FcmService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
      ],
      providers: [FcmService, ConfigService],
    }).compile();

    fcmService = app.get<FcmService>(FcmService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('fcm messaging', () => {
    it('send test', async ()=> {
      // const result = await fcmService.sendMessage()
      const result = configService.get('FIRE_BASE_CONFIG')
      console.log(result)
    })
  });
});
