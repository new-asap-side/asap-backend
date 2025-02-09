import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import {AuthModule} from '@src/auth/auth.module';
import { DatabaseModule } from '@src/database/database.module';
import { ProfileModule } from '@src/profile/profile.module';
import { GroupModule } from '@src/group/group.module';
import { FcmService } from '@src/alarm/fcm/fcm.service';
import { AlarmModule } from '@src/alarm/alarm.module';
import { ApnModule } from '@src/alarm/apn/apn.module';
import { ConfigurationModule } from '@src/config/config.module';
import { AdminModule } from '@src/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    ConfigurationModule,
    DatabaseModule,
    AuthModule,
    ProfileModule,
    GroupModule,
    AlarmModule,
    ApnModule
  ],
  controllers: [AppController],
  providers: [FcmService]
})
export class AppModule {}
