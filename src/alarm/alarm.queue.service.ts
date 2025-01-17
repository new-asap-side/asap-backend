import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { AddAlarmJobDto, DeviceTypeEnum } from '@src/dto/dto.group';
import { AlarmPayload } from '@src/dto/dto.fcm_apns';

// dayjs에 플러그인 등록
dayjs.extend(utc);
dayjs.extend(timezone);

// 요일 매핑 (요일을 숫자로 변환)
const dayMapping: Record<string, number> = {
  '월': 1,
  '화': 2,
  '수': 3,
  '목': 4,
  '금': 5,
  '토': 6,
  '일': 7,
};

@Injectable()
export class AlarmQueueService {
  constructor(
    @InjectQueue('androidAlarmQueue') private readonly androidAlarmQueue: Queue,
    @InjectQueue('iosAlarmQueue') private readonly iosAlarmQueue: Queue,
    @InjectQueue('AlarmQueue') private readonly alarmQueue: Queue
  ) {}

  // 알람을 큐에 추가하는 메소드
  async addAlarmJob(
    alarmData: AddAlarmJobDto,
    deviceToken: string,
    deviceType: DeviceTypeEnum,
    alarmPayload: AlarmPayload
  ) {
    // 알람 종료일자와 요일, 시간에 맞는 알람 날짜 계산
    const triggerDates = this.calculateAlarmTriggerDates(alarmData);

    // 알람 날짜들에 대해 각각 큐에 작업을 추가
    for (const triggerDate of triggerDates) {
      const diffTime = triggerDate.diff(dayjs(), 'millisecond')
      console.log(`triggerDate: ${triggerDate}, diffTime: ${diffTime}, TK: ${deviceToken}`)
      if (deviceType === DeviceTypeEnum.ANDROID) {
        await this.androidAlarmQueue.add('sendAlarm', {
          fcmToken: deviceToken,
          alarmPayload
        }, { delay: diffTime }); // 알람이 울릴 때까지의 대기 시간

      } else if (deviceType === DeviceTypeEnum.IOS) {
        await this.iosAlarmQueue.add('sendIosAlarm', {
          deviceToken,
          alarmPayload
        }, { delay: diffTime }); // 알람이 울릴 때까지의 대기 시간
      }
    }
  }

  // 알람이 울릴 날짜를 계산하는 메소드
  public calculateAlarmTriggerDates(alarmData: AddAlarmJobDto): dayjs.Dayjs[] {
    const triggerDates: dayjs.Dayjs[] = [];
    let currentDate = dayjs().tz('Asia/Seoul', true);  // 현재 날짜를 서울 시간대 기준으로 초기화

    // 알람이 울려야 하는 요일과 시간을 기준으로 알람 날짜 계산
    const targetDay = dayMapping[alarmData.alarm_day];  // 알람 요일을 숫자로 변환 (1: 월, 2: 화, ..., 7: 일)
    const targetTime = alarmData.alarm_time.split(':');
    const targetHour = parseInt(targetTime[0]);
    const targetMinute = parseInt(targetTime[1]);

    // 종료일자까지 반복하면서 알람을 울릴 날짜를 계산
    // currentDate는 종료일자보다 앞선 날짜로 시작해야 한다.
    // 종료일자까지 알람을 울려야 하므로 currentDate를 알람 첫 날짜로 설정
    while (currentDate.isBefore(dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true)) ||
          currentDate.isSame(dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true))) {
      // 현재 날짜에서 목표 요일까지의 차이 계산 (현재 날짜가 목표 요일보다 이전이면 차이 계산)
      const dayDiff = (targetDay - currentDate.day() + 7) % 7;

      // 목표 요일이 이미 지났다면, 다음 주로 넘어가도록 처리
      let alarmDate = currentDate.add(dayDiff, 'day').set('hour', targetHour).set('minute', targetMinute).set('second', 0);

      // 종료일자에 맞춰 알람이 울려야 하므로 종료일자를 포함
      if (alarmDate.isBefore(dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true)) ||
          alarmDate.isSame(dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true))) {
        triggerDates.push(alarmDate);
      }

      // 알람 날짜가 지나면 다음 주로 넘어가기
      currentDate = currentDate.add(1, 'week');
    }

    return triggerDates;
  }

  async emitAlarmOff(userId: number, groupId: number) {
    await this.alarmQueue.add('offAlarm', { userId, groupId })
  }
}
