import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import * as process from "node:process";
import {AuthModule} from '@src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { ProfileModule } from '@src/profile/profile.module';
import { GroupModule } from '@src/group/group.module';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmModule } from '@src/event/event.alarm.module';
import { S3Service } from '@src/S3/S3.service';
import { ApnModule } from '@src/apn/apn.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env': '.env.local',
      isGlobal: true,
    }),
    ProfileModule,
    GroupModule,
    AlarmModule,
    ApnModule
  ],
  controllers: [AppController],
  providers: [FcmService]
})
export class AppModule {}
