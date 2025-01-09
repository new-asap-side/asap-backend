import { AlarmTypeEnum } from '@src/database/entity/userGroup';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';

export interface AlarmPayload {
  group_id: string,
  group_title: string,
  music_title: string,
  alarm_type: AlarmTypeEnum,
  music_volume: string,
  alarm_unlock_contents: AlarmUnlockContentsEnum
}