import { Module } from '@nestjs/common';
import { AlarmQueueService } from '@src/event/event.alarm.service';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmProcessor } from '@src/event/event.alarmProcessor';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        }
      },

    }),
    BullModule.registerQueue({
      name: 'alarmQueue',
    }),
  ],
  providers: [AlarmQueueService, FcmService, AlarmProcessor],
  exports: [AlarmQueueService, FcmService, BullModule, AlarmProcessor]
})
export class AlarmModule {}
