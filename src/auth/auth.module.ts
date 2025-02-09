import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { AuthController } from '@src/auth/auth.controller';
import { KakaoAuthService } from '@src/auth/kakao-auth.service';
import { AppleAuthService } from '@src/auth/apple-auth.service';
import { AccessTokenStrategy } from '@src/libs/jwt/access-token-strategy.service';
import { RefreshTokenStrategy } from '@src/libs/jwt/refresh-token-strategy.service';
import { AuthService } from '@src/auth/auth.service';
import { JwtStrategyModule } from '@src/libs/jwt/jwt.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
      HttpModule,
      DatabaseModule,
      JwtStrategyModule
    ],
    controllers: [AuthController],
    providers: [
        KakaoAuthService,
        AppleAuthService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        AuthService
    ],
})
export class AuthModule {}
