import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlarmQueueService } from '@src/event/event.alarm.service';
import { AlarmDayEnum, DeviceTypeEnum } from '@src/dto/dto.group';
import { AlarmModule } from '@src/event/event.alarm.module';
import dayjs from 'dayjs';
import { AlarmUnlockContentsEnum } from '@src/database/entity/userGroup';

describe('FcmService Test', () => {
  let alarmQueueService: AlarmQueueService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
        AlarmModule
      ],
      providers: [AlarmQueueService, ConfigService],
    }).compile();

    alarmQueueService = app.get<AlarmQueueService>(AlarmQueueService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('time value test', () => {
    it('calculateAlarmTriggerDates test', async ()=> {
      const result = alarmQueueService.calculateAlarmTriggerDates(
        {
          alarm_end_date: new Date('2024-11-30 23:59:59'),
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
          alarm_end_date: new Date('2024-11-30 23:59:59'),
          alarm_time: '21:15',
          alarm_day: AlarmDayEnum.수,
        alarm_unlock_contents: AlarmUnlockContentsEnum.card
        }, "aaaa", DeviceTypeEnum.IOS)

    });
  });
});
