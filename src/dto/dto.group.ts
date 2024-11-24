import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { AlarmTypeEnum } from '@src/database/entity/userGroup';

export enum AlarmDayEnum {
  '월'='월',
  '화'='화',
  '수'='수',
  '목'='목',
  '금'='금',
  '토'='토',
  '일'='일',
}

export class CreateAlarmDateDto {
  @ApiProperty({description: '알람 종료 날짜, YYYY-MM-DD 23:59:59'})
  @IsNotEmpty()
  @IsDate()
  alarm_end_date: Date;

  @ApiProperty({
    description: '알람 요일',
    enum: AlarmDayEnum,
    example: AlarmDayEnum.수
  })
  @IsNotEmpty()
  @IsEnum(AlarmDayEnum)
  alarm_day: AlarmDayEnum;

  @ApiProperty({description: '알람 시간 HH:mm', example: "21:15"})
  @IsNotEmpty()
  @IsString()
  alarm_time: string;
}

export class CreateGroupDto extends CreateAlarmDateDto {
  @ApiProperty({description: '그룹장이 될사람의 user_id값'})
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty({description: '그룹장이 될사람의 fcm 디바이스 토큰'})
  @IsNotEmpty()
  @IsString()
  fcm_token: string;

  @ApiProperty({description: '그룹 제목'})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({description: '그룹 설명'})
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({description: '최대인원'})
  @IsNotEmpty()
  @IsNumber()
  max_person: number;

  @ApiProperty({description: '공개 그룹 여부, true: 공개, false: 비공개'})
  @IsNotEmpty()
  @IsBoolean()
  is_public: boolean;

  @ApiProperty({description: '비공개 그룹 비밀번호 string 숫자4자리'})
  @IsString()
  @Matches(/^\d{4}$/, {message: 'must be a 4-digit number'})
  group_password: string;

  @ApiProperty({
    description: '알람 방식, sound/vibration/all',
    enum: AlarmTypeEnum,
    example: AlarmTypeEnum.vibration
  })
  @IsNotEmpty()
  @IsEnum(AlarmTypeEnum)
  alarm_type: AlarmTypeEnum

  @ApiProperty({description: '알람 음량, 기본값 10, 최대값 100'})
  @IsNotEmpty()
  @IsNumber()
  alarm_volume: number

  @ApiProperty({description: '알람음 제목, 이거 구현방식 논의 필요할듯'})
  @IsNotEmpty()
  @IsString()
  music_title: string
}

export class JoinGroupDto {
  @ApiProperty({description: '참여자의 user_id 값'})
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty({description: '참여할 group의 id값'})
  @IsNotEmpty()
  @IsNumber()
  group_id: number

  @ApiProperty({description: '참여자 fcm 디바이스 토큰값'})
  @IsNotEmpty()
  @IsString()
  fcm_token: string;

  @ApiProperty({description: '비공개 그룹 비밀번호 string 숫자4자리'})
  @IsString()
  @Matches(/^\d{4}$/, {message: 'must be a 4-digit number'})
  group_password: string;

  @ApiProperty({
    description: '알람 방식, sound/vibration/all',
    enum: AlarmTypeEnum,
    example: AlarmTypeEnum.vibration
  })
  @IsNotEmpty()
  @IsEnum(AlarmTypeEnum)
  alarm_type: AlarmTypeEnum
}

export class EditGroupDto {
  @ApiProperty({description: '그룹장의 user_id값'})
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty({description: '수정할 group_id값'})
  @IsNotEmpty()
  @IsNumber()
  group_id: number

  @ApiProperty({description: '수정 할 그룹 제목'})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({description: '수정 할 그룹 설명'})
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({description: '수정 할 최대인원'})
  @IsNotEmpty()
  @IsNumber()
  max_person: number;

  @ApiProperty({description: '수정 할 공개 그룹 여부, true: 공개, false: 비공개'})
  @IsNotEmpty()
  @IsBoolean()
  is_public: boolean;
}

export class EditPersonalDto {
  @ApiProperty({description: '참여자의 user_id 값'})
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty({description: '참여할 group의 id값'})
  @IsNotEmpty()
  @IsNumber()
  group_id: number

  @ApiProperty({
    description: '알람 방식, sound/vibration/all',
    enum: AlarmTypeEnum,
    example: AlarmTypeEnum.vibration
  })
  @IsNotEmpty()
  @IsEnum(AlarmTypeEnum)
  alarm_type: AlarmTypeEnum

  @ApiProperty({description: '알람 음량, 기본값 10, 최대값 100'})
  @IsNotEmpty()
  @IsNumber()
  alarm_volume: number

  @ApiProperty({description: '알람음 제목, 이거 구현방식 논의 필요할듯'})
  @IsNotEmpty()
  @IsString()
  music_title: string
}

export class CreateGroupResponse {
  @ApiProperty()
  @IsNumber()
  groupId: number

  @ApiProperty()
  @IsString()
  message: string
}
export class JoinGroupResponse extends CreateGroupResponse{
}

export class GroupResponse {
  @ApiProperty()
  @IsBoolean()
  result: boolean

  @ApiProperty()
  @IsString()
  message: string
}