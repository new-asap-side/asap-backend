import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import * as process from "node:process";
import {AuthModule} from '@src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { ProfileController } from '@src/profile/profile.controller';
import { ProfileService } from '@src/profile/profile.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
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
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
