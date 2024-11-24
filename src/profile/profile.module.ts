import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from '@src/profile/profile.controller';
import { ProfileService } from '@src/profile/profile.service';
import { S3Module } from '@src/S3/S3.module';

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
    }),
    S3Module
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
