import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlarmQueueService } from '@src/alarm/alarm.queue.service';
import { DeviceTypeEnum } from '@src/dto/dto.group';
import { AlarmModule } from '@src/alarm/alarm.module';
import dayjs from 'dayjs';

import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';
import { AlarmService } from '@src/alarm/alarm.service';
import { AlarmDayEnum } from '@src/database/enum/alarmDaysEnum';
import { DatabaseModule } from '@src/database/database.module';

describe('FcmService Test', () => {
  let alarmQueueService: AlarmQueueService;
  let alarmService: AlarmService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
        AlarmModule,
        DatabaseModule
      ],
      providers: [AlarmQueueService, ConfigService, AlarmService],
    }).compile();

    alarmQueueService = app.get<AlarmQueueService>(AlarmQueueService);
    configService = app.get<ConfigService>(ConfigService);
    alarmService = app.get<AlarmService>(AlarmService);
  });

  describe('time value test', () => {
    it('calculateAlarmTriggerDates test', async ()=> {
      const result = alarmQueueService.calculateAlarmTriggerDates(
        {
          alarm_end_date: '2024-11-30 23:59:59',
          alarm_time: '21:15',
          alarm_day: AlarmDayEnum.수,
          alarm_unlock_contents: AlarmUnlockContentsEnum.card
        }
      )
      const a = result.map(v=> v.diff(dayjs(), 'millisecond'))
      console.log(a)
    })

    it('should emit job', () => {
      alarmQueueService.addAlarmJob({
          alarm_end_date: '2024-11-30 23:59:59',
          alarm_time: '21:15',
          alarm_day: AlarmDayEnum.수,
        alarm_unlock_contents: AlarmUnlockContentsEnum.card
        }, "aaaa", DeviceTypeEnum.IOS, 1)
    });

    it('should test getUserAlarmUnlockRate',async () => {
      const result = await alarmService.getUserAlarmUnlockRate(0)
      console.log(result)
    });
  });
});
