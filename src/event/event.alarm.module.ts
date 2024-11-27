import { Module } from '@nestjs/common';
import { AlarmQueueService } from '@src/event/event.alarm.service';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmProcessor, IosAlarmProcessor } from '@src/event/event.alarmProcessor';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApnService } from '@src/apn/apn.service';
import { ApnConfig } from '@src/apn/apn.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(`REDIS_HOST:${ config.get<string>('REDIS_HOST')}`)
        return {
          redis: {
            host: config.get<string>('REDIS_HOST'),
            port: 6379,
            db: 0,
            password: config.get<string>('REDIS_PASSWORD')
          },
          defaultJobOptions: {
            removeOnComplete: 10,
            removeOnFail: 10,
          },
        }
      },

    }),
    BullModule.registerQueue({
      name: 'alarmQueue',
    }),
    BullModule.registerQueue({
      name: 'iosAlarmQueue',
    }),
  ],
  providers: [
    AlarmQueueService,
    FcmService,
    AlarmProcessor,
    IosAlarmProcessor,
    ApnService,
    ApnConfig
  ],
  exports: [
    AlarmQueueService,
    FcmService,
    BullModule,
    AlarmProcessor,
    IosAlarmProcessor,
    ApnService,
    ApnConfig
  ]
})
export class AlarmModule {}
