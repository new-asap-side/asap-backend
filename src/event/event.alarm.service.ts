import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';  // UTC 플러그인
import timezone from 'dayjs/plugin/timezone';
import { CreateAlarmDateDto } from '@src/dto/dto.group';  // timezone 플러그인

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
    @InjectQueue('alarmQueue') private readonly alarmQueue: Queue
  ) {}

  // 알람을 큐에 추가하는 메소드
  async addAlarmJob(alarmData: CreateAlarmDateDto, fcmToken: string) {
    // 알람 종료일자와 요일, 시간에 맞는 알람 날짜 계산
    const triggerDates = this.calculateAlarmTriggerDates(alarmData);

    // 알람 날짜들에 대해 각각 큐에 작업을 추가
    for (const triggerDate of triggerDates) {
      await this.alarmQueue.add('sendAlarm', {
        triggerDate,
        fcmToken,
      }, {
        delay: triggerDate.diff(dayjs(), 'millisecond'), // 알람이 울릴 때까지의 대기 시간
        removeOnComplete: true, // 작업 완료 후 큐에서 삭제
      });
    }
  }

  // 알람이 울릴 날짜를 계산하는 메소드
  private calculateAlarmTriggerDates(alarmData: CreateAlarmDateDto): dayjs.Dayjs[] {
    const triggerDates: dayjs.Dayjs[] = [];
    let currentDate = dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true);  // 종료일자를 서울 시간대로 설정

    // 알람이 울려야 하는 요일과 시간을 기준으로 알람 날짜 계산
    const targetDay = dayMapping[alarmData.alarm_day];  // 알람 요일을 숫자로 변환
    const targetTime = alarmData.alarm_time.split(':');
    const targetHour = parseInt(targetTime[0]);
    const targetMinute = parseInt(targetTime[1]);

    // 종료일자까지 반복하면서 알람을 울릴 날짜를 계산
    while (currentDate.isBefore(dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true))) {
      // 현재 날짜에서 다음 지정된 요일까지의 차이 계산
      const dayDiff = (targetDay - currentDate.day() + 7) % 7;
      let alarmDate = currentDate.add(dayDiff, 'day').set('hour', targetHour).set('minute', targetMinute).set('second', 0);

      // 종료일자 이전에 알람이 울려야 하는 날짜만 추가
      if (alarmDate.isBefore(dayjs(alarmData.alarm_end_date).tz('Asia/Seoul', true))) {
        triggerDates.push(alarmDate);
      }

      // 다음 주로 넘어가기 위해서 종료일자가 지나면 종료
      currentDate = currentDate.add(1, 'week');
    }

    return triggerDates;
  }
}
