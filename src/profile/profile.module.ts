import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from '@src/profile/profile.controller';
import { ProfileService } from '@src/profile/profile.service';
import { S3Service } from '@src/S3/S3.service';

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
  providers: [ProfileService, S3Service],
  exports: [ProfileService]
})
export class ProfileModule {}
