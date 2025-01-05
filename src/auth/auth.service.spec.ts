import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KakaoAuthService } from '@src/auth/kakao-auth.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AuthService } from '@src/auth/auth.service';
import { DatabaseModule } from '@src/database/database.module';
import { JwtService } from '@nestjs/jwt';

describe('FcmService Test', () => {
  let kakaoAuthService: KakaoAuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
      ],
      providers: [KakaoAuthService, ConfigService, AuthService, JwtService],
    }).compile();

    kakaoAuthService = app.get<KakaoAuthService>(KakaoAuthService);
    configService = app.get<ConfigService>(ConfigService);
  });

  it('send test', async ()=> {
    await kakaoAuthService.signUpKakaoUser('3771118318')
  })
});
