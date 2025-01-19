import { Module } from '@nestjs/common';
import { AlarmQueueService } from '@src/alarm/alarm.queue.service';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmProcessor, AndroidAlarmProcessor, IosAlarmProcessor } from '@src/alarm/alarm.Processor';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApnService } from '@src/apn/apn.service';
import { ApnConfig } from '@src/apn/apn.config';
import { HttpModule } from '@nestjs/axios';
import { AlarmService } from '@src/alarm/alarm.service';
import { DatabaseModule } from '@src/database/database.module';
import { AlarmController } from '@src/alarm/alarm.controller';
import { AlarmActionQueueEnum, AndroidQueueEnum, IosQueueEnum } from '@src/database/enum/queueEnum';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
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
      name: AndroidQueueEnum.NAME,
    }),
    BullModule.registerQueue({
      name: IosQueueEnum.NAME,
    }),
    BullModule.registerQueue({
      name: AlarmActionQueueEnum.NAME,
    }),
  ],
  providers: [
    AlarmQueueService,
    FcmService,
    AndroidAlarmProcessor,
    IosAlarmProcessor,
    AlarmProcessor,
    ApnService,
    ApnConfig,
    AlarmService
  ],
  controllers: [AlarmController],
  exports: [
    AlarmQueueService,
    FcmService,
    BullModule,
    AndroidAlarmProcessor,
    IosAlarmProcessor,
    AlarmProcessor,
    ApnService,
    ApnConfig,
    AlarmService
  ]
})
export class AlarmModule {}
