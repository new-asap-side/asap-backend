import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AlarmQueueService } from '@src/event/event.alarm.service';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmProcessor } from '@src/event/event.alarmProcessor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'alarmQueue',
    }),
  ],
  providers: [AlarmQueueService, FcmService, AlarmProcessor],
  exports: [AlarmQueueService, FcmService]
})
export class AlarmModule {}
