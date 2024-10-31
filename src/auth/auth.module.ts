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

@Module({
    imports: [
        DatabaseModule,
        HttpModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_SECRET_KEY'),  // 공통 비밀 키

                }
            }
        }),
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
