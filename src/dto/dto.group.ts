import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { AlarmTypeEnum } from '@src/database/entity/userGroup';
import { Group } from '@src/database/entity/group';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AlarmUnlockContentsEnum } from '@src/database/enum/alarmUnlockContentsEnum';
import { GroupStatusEnum } from '@src/database/enum/groupStatusEnum';

export enum DeviceTypeEnum {
  'ANDROID' = 'ANDROID',
  'IOS' = 'IOS'
}

export enum AlarmDayEnum {
  '월'='월',
  '화'='화',
  '수'='수',
  '목'='목',
  '금'='금',
  '토'='토',
  '일'='일',
}

export class ReadGroupResponseDto {
    @ApiProperty()
    group_id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    max_person: number;

    @ApiProperty()
    current_person: number;

    @ApiProperty()
    is_public: boolean;

    @ApiProperty()
    group_password: string;

    @ApiProperty()
    alarm_end_date: string;

    @ApiProperty()
    alarm_time: string;

    @ApiProperty()
    view_count: number;

    @ApiProperty()
    group_thumbnail_image_url: string;

    @ApiProperty({
      enum: GroupStatusEnum,
      isArray: false,
      example: GroupStatusEnum.live
    })
    status: GroupStatusEnum;

    @ApiProperty({
      enum: AlarmUnlockContentsEnum,
      isArray: false,
      example: AlarmUnlockContentsEnum.card
    })
    alarm_unlock_contents: AlarmUnlockContentsEnum;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}

export class CreateAlarmDateDto {
  @ApiProperty({description: '알람 종료 날짜, YYYY-MM-DD 23:59:59'})
  @IsNotEmpty()
  @IsString()
  alarm_end_date: string;

  @ApiProperty({
    description: '알람 요일 목록',
    enum: AlarmDayEnum,
    isArray: true,
    example: [AlarmDayEnum.수, AlarmDayEnum.금],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(AlarmDayEnum, { each: true }) // 배열 내 각 값이 Enum에 속해야 함
  alarm_days: AlarmDayEnum[];

  @ApiProperty({description: '알람 시간 HH:mm', example: "21:15"})
  @IsNotEmpty()
  @IsString()
  alarm_time: string;

  @ApiProperty({
  description: '알람 해제 컨텐츠, slid/card',
  enum: AlarmUnlockContentsEnum,
  example: AlarmUnlockContentsEnum.card
  })
  @IsNotEmpty()
  @IsEnum(AlarmUnlockContentsEnum)
  alarm_unlock_contents: AlarmUnlockContentsEnum
}

export class AddAlarmJobDto {
    alarm_end_date: string;
    alarm_day: AlarmDayEnum;
    alarm_time: string;
    alarm_unlock_contents: AlarmUnlockContentsEnum
}

export class CreateGroupDto extends CreateAlarmDateDto {
  @ApiProperty({description: '그룹장이 될사람의 user_id값'})
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty({description: '그룹 썸네일 base64인코딩된 이미지'})
  @IsString()
  base64_group_img: string

  @ApiProperty({description: '디바이스 토큰값(Android는 fcm토큰, IOS는 APNsDevice 토큰)'})
  @IsNotEmpty()
  @IsString()
  device_token: string;

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

  @ApiPropertyOptional({
    description: '비공개 그룹 비밀번호 (숫자 4자리, 선택 사항)',
    example: '1234',
  })
  @IsOptional() // 필드가 선택 사항임을 나타냄
  @IsString()
  @Matches(/^\d{4}$/, { message: 'must be a 4-digit number' })
  group_password?: string; // 필드를 optional로 설정

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

  @ApiProperty({
  description: '디바이스 타입, IOS/ANDROID',
  enum: DeviceTypeEnum,
  example: DeviceTypeEnum.IOS
  })
  @IsNotEmpty()
  @IsEnum(DeviceTypeEnum)
  device_type: DeviceTypeEnum
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

  @ApiProperty({description: '디바이스 토큰값(Android는 fcm토큰, IOS는 APNsDevice 토큰)'})
  @IsNotEmpty()
  @IsString()
  device_token: string;

  @ApiPropertyOptional({
    description: '비공개 그룹 비밀번호 (숫자 4자리, 선택 사항)',
    example: '1234',
  })
  @IsOptional() // 필드가 선택 사항임을 나타냄
  @IsString()
  @Matches(/^\d{4}$/, { message: 'must be a 4-digit number' })
  group_password?: string; // 필드를 optional로 설정

  @ApiProperty({
    description: '알람 방식, sound/vibration/all',
    enum: AlarmTypeEnum,
    example: AlarmTypeEnum.vibration
  })
  @IsNotEmpty()
  @IsEnum(AlarmTypeEnum)
  alarm_type: AlarmTypeEnum

  @ApiProperty({
  description: '디바이스 타입, IOS/ANDROID',
  enum: DeviceTypeEnum,
  example: DeviceTypeEnum.IOS
  })
  @IsNotEmpty()
  @IsEnum(DeviceTypeEnum)
  device_type: DeviceTypeEnum
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

  @ApiProperty({
  description: '알람 해제 컨텐츠, slid/card',
  enum: AlarmUnlockContentsEnum,
  example: AlarmUnlockContentsEnum.card
  })
  @IsNotEmpty()
  @IsEnum(AlarmUnlockContentsEnum)
  alarm_unlock_contents: AlarmUnlockContentsEnum

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

export class RemovePersonalDto {
  @ApiProperty({description: '참여자의 user_id 값'})
  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @ApiProperty({description: '참여할 group의 id값'})
  @IsNotEmpty()
  @IsNumber()
  group_id: number
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

export class UserDto {
  @ApiProperty({ description: '사용자 닉네임', example: '건희' })
  nick_name: string;

  @ApiProperty({
    description: '사용자 프로필 이미지 URL',
    example: 'https://asap-data.s3.ap-southeast-2.amazonaws.com/5723357f-531e-49fa-82dc-21bc1f27ef2f.jpeg',
  })
  profile_image_url: string;
}

export class UserGroupDto {
  @ApiProperty({ description: '유저 ID', example: 2 })
  user_id: number;

  @ApiProperty({ description: '알람 타입', example: 'SOUND', enum: ['SOUND', 'VIBRATION', 'ALL'] })
  alarm_type: string;

  @ApiProperty({ description: '음악 제목', example: 'string' })
  music_title: string;

  @ApiProperty({ description: '볼륨', example: 10 })
  volume: number;

  @ApiProperty({ description: '그룹 마스터 여부', example: true })
  is_group_master: boolean;

  @ApiProperty({ description: '사용자 정보', type: UserDto })
  user: UserDto;
}

export class AlarmDayDto {
  @ApiProperty({ description: '알람 요일', example: '월' })
  alarm_day: string;
}

export class GroupDetailsResponseDto {
  @ApiProperty({ description: '그룹 ID', example: 5 })
  group_id: number;

  @ApiProperty({ description: '그룹 제목', example: '그룹입니다다' })
  title: string;

  @ApiProperty({ description: '그룹 설명', example: '그룹' })
  description: string;

  @ApiProperty({ description: '최대 인원수', example: 7 })
  max_person: number;

  @ApiProperty({ description: '현재 인원수', example: 0 })
  current_person: number;

  @ApiProperty({ description: '공개 여부', example: true })
  is_public: boolean;

  @ApiProperty({ description: '알람 종료 날짜', example: '2024-12-26T23:59:59Z' })
  alarm_end_date: string;

  @ApiProperty({ description: '알람 시간', example: '01:07' })
  alarm_time: string;

  @ApiProperty({ description: '조회수', example: 0 })
  view_count: number;

  @ApiProperty({
    description: '그룹 썸네일 이미지 URL',
    example: 'https://asap-data.s3.ap-southeast-2.amazonaws.com/1d4645c1-7803-4d82-b87b-bfff3a87473d.jpeg',
  })
  group_thumbnail_image_url: string;

  @ApiProperty({ description: '그룹 상태', example: 'LIVE', enum: ['LIVE', 'CLOSED'] })
  status: string;

  @ApiProperty({
    description: '알람 해제 콘텐츠',
    example: 'SLIDE',
    enum: ['SLIDE', 'TAP', 'OTHER'],
  })
  alarm_unlock_contents: string;

  @ApiProperty({ description: '유저 그룹 리스트', type: [UserGroupDto] })
  userGroups: UserGroupDto[];

  @ApiProperty({ description: '알람 요일 리스트', type: [AlarmDayDto] })
  alarm_days: AlarmDayDto[];
}
