import { Module } from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { AuthController } from '@src/auth/auth.controller';
import { KakaoAuthService } from '@src/auth/kakao-auth.service';
import { AppleAuthService } from '@src/auth/apple-auth.service';
import { AccessTokenStrategy } from '@src/jwt/access-token-strategy.service';
import { RefreshTokenStrategy } from '@src/jwt/refresh-token-strategy.service';
import { AuthService } from '@src/auth/auth.service';
import { JwtStrategyModule } from '@src/jwt/jwt.module';

@Module({
    imports: [
        DatabaseModule,
        HttpModule,
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
