import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from '@src/jwt/access-token-strategy.service';
import { RefreshTokenStrategy } from '@src/jwt/refresh-token-strategy.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),  // 공통 비밀 키
        }
      }
    })
  ],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
  exports: [JwtModule, AccessTokenStrategy, RefreshTokenStrategy]
})
export class JwtStrategyModule {}
