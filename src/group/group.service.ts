import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/database/entity/user';
import { Group, GroupStatusEnum } from '@src/database/entity/group';
import { UserGroup } from '@src/database/entity/userGroup';
import {
  CreateGroupDto,
  EditGroupDto,
  EditPersonalDto,
  GroupResponse,
  JoinGroupDto,
  CreateGroupResponse, JoinGroupResponse, RemovePersonalDto,
} from '@src/dto/dto.group';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmQueueService } from '@src/event/event.alarm.service';
import { Alarm } from '@src/database/entity/alarm';
import { S3Service } from '@src/S3/S3.service';

@Injectable()
export class GroupService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: Repository<UserGroup>,
    @InjectRepository(Alarm)
    private readonly alarmRepo: Repository<Alarm>,
    private readonly alarmQueueService: AlarmQueueService,
    private readonly s3Service: S3Service
  ) {}

  // 새 그룹 생성 후 해당유저부터 새 그룹 구독시키기
  public async createGroup(createGroupDto: CreateGroupDto) {
    if(!createGroupDto.user_id) return {result: false, message: 'user_id 값이 없습니다.'}

    const user = await this.userRepo.findOneBy({ user_id: createGroupDto.user_id });
    if (!user) {
      throw new Error('User not found');
    }
    if(!createGroupDto.is_public && !createGroupDto.group_password) {
      throw new Error('Please password typing!')
    }
    const group_thumbnail_image_url = await this.s3Service.upload(createGroupDto.base64_group_img)

    // 그룹생성
    const groupEntity = this.groupRepo.create({
      title: createGroupDto.title,
      description: createGroupDto.description,
      max_person: createGroupDto.max_person,
      is_public: createGroupDto.is_public,
      group_password: createGroupDto.is_public ? null : createGroupDto.group_password,
      alarm_end_date: createGroupDto.alarm_end_date,
      alarm_time: createGroupDto.alarm_time,
      status: GroupStatusEnum.live,
      alarm_unlock_contents: createGroupDto.alarm_unlock_contents,
      group_thumbnail_image_url
    });
    const savedGroup = await this.groupRepo.save(groupEntity);
    this.logger.log(`createGroupDto.alarm_days arr: ${createGroupDto.alarm_days}`)
    this.logger.log(`createGroupDto.alarm_days str: ${JSON.stringify(createGroupDto.alarm_days)}`)
    for (const alarmDay of createGroupDto.alarm_days) {
      const alarm = this.alarmRepo.create({
        alarm_day: alarmDay,
        group: savedGroup
      })
      await this.alarmRepo.save(alarm);
    }

    // user-group 관계 생성
    const userGroup = this.userGroupRepo.create({
      user: user,
      group: savedGroup,
      alarm_type: createGroupDto.alarm_type,
      volume: createGroupDto.alarm_volume,
      music_title: createGroupDto.music_title,
      is_group_master: true
    });
    await this.userGroupRepo.save(userGroup);

    await this.emitAlarmQueue(savedGroup, createGroupDto)

    return {
      message: 'Group created successfully and user subscribed to the topic.',
      groupId: savedGroup.group_id,
    };
  }

  // Join an existing group and subscribe the user to the group's topic
  public async joinGroup(joinGroupDto: JoinGroupDto): Promise<JoinGroupResponse> {
    const user = await this.userRepo.findOneBy({ user_id: joinGroupDto.user_id });
    if (!user) {
      throw new Error('User not found');
    }

    const group = await this.groupRepo.findOneBy({ group_id: joinGroupDto.group_id });
    if (!group) {
      throw new Error('Group not found');
    }

    // Create a user-group relation
    const userGroup = this.userGroupRepo.create({
      user: user,
      group: group,
    });
    await this.userGroupRepo.save(userGroup);

    // 구독방식은 속도가 너무 느려서 redis job으로 유저에게 직접 쏘도록 구현해보자
    await this.emitAlarmQueue(group, joinGroupDto)

    this.logger.log(`User ${user.user_id} joined group ${group.title} and subscribed to topic group-${group.group_id}`);

    return {
      message: 'User joined the group and scheduling to the alarm.',
      groupId: group.group_id,
    };
  }

  public async editGroup(editGroupDto: EditGroupDto): Promise<GroupResponse> {
    const { user_id, group_id, is_public, max_person ,description ,title, alarm_unlock_contents } = editGroupDto
    if(!user_id || !group_id) return {result: false, message: 'user_id 혹은 group_id 값이 없습니다.'}

    const userGroup = await this.userGroupRepo.findOneBy({ user_id, group_id })
    if(!userGroup.is_group_master) return { result: false, message: '그룹장이 아닙니다.'}

    const group = await this.groupRepo.findOneBy({group_id: group_id})
    if(!(max_person >= group.current_person)) return { result: false, message: '최대인원 설정값은 현재인원 이상으로만 변경가능합니다.'}

    const { affected } = await this.groupRepo.update(
      { group_id: group_id },
      { is_public, max_person, description, title, alarm_unlock_contents }
    )
    if(affected == 0) return { result: false, message: '이전 내용과 동일합니다.' }

    return { result: true, message: '수정되었습니다.' }
  }

  public async editPersonalGroup(editPersonalDto: EditPersonalDto): Promise<GroupResponse> {
    const { user_id, group_id, music_title, alarm_type, alarm_volume } = editPersonalDto
    if(!user_id || !group_id) return {result: false, message: 'user_id 혹은 group_id 값이 없습니다.'}

    const userGroup = await this.userGroupRepo.findOneBy({ user_id, group_id })
    if(!userGroup) return { result: false, message: '수정 할 userGroup 데이터를 찾지 못했습니다.' }

    const { affected } = await this.userGroupRepo.update(
      { user_id, group_id },
      { music_title, alarm_type, volume: alarm_volume }
    )
    if(affected == 0) return { result: false, message: '이전 내용과 동일합니다.' }

    return { result: true, message: '수정되었습니다.' }
  }

  public async removePersonalGroup(removePersonalDto: RemovePersonalDto): Promise<GroupResponse> {
    const { user_id, group_id } = removePersonalDto
    if(!user_id || !group_id) return {result: false, message: 'user_id 혹은 group_id 값이 없습니다.'}

    const userGroup = await this.userGroupRepo.findOneBy({ user_id, group_id })
    if(!userGroup) return { result: false, message: '삭제할 할 userGroup 데이터를 찾지 못했습니다.' }

    const { affected } = await this.userGroupRepo.delete({ user_id, group_id })
    if(affected == 0) return { result: false, message: '삭제할 데이터가 없습니다.' }

    return { result: true, message: '삭제되었습니다.' }
  }

  private async emitAlarmQueue(group: Group, joinGroupDto: JoinGroupDto | CreateGroupDto) {
    const {alarm_end_date, alarm_days, alarm_time, alarm_unlock_contents} = group
    for (const alarmDayEntity of alarm_days) {
      await this.alarmQueueService.addAlarmJob(
        {
          alarm_end_date,
          alarm_day: alarmDayEntity.alarm_day,
          alarm_time,
          alarm_unlock_contents
        },
        joinGroupDto.device_token,
        joinGroupDto.device_type
      )
    }
  }
}