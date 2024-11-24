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
  CreateGroupResponse, JoinGroupResponse,
} from '@src/dto/dto.group';
import { FcmService } from '@src/fcm/fcm.service';
import { AlarmQueueService } from '@src/event/event.alarm.service';

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
    private readonly fcmService: FcmService,
    private readonly alarmQueueService: AlarmQueueService
  ) {}

  // 새 그룹 생성 후 해당유저부터 새 그룹 구독시키기
  public async createGroup(createGroupDto: CreateGroupDto) {
    const user = await this.userRepo.findOneBy({ id: createGroupDto.user_id });
    if (!user) {
      throw new Error('User not found');
    }

    // 그룹생성
    const group = this.groupRepo.create({
      title: createGroupDto.title,
      description: createGroupDto.description,
      max_person: createGroupDto.max_person,
      is_public: createGroupDto.is_public,
      group_password: createGroupDto.is_public ? null : createGroupDto.group_password,
      alarm_end_date: createGroupDto.alarm_end_date,
      alarm_hour_min: createGroupDto.alarm_time,
      status: GroupStatusEnum.live
    });
    await this.groupRepo.save(group);

    // user-group 관계 생성
    const userGroup = this.userGroupRepo.create({
      user: user,
      group: group,
      alarm_type: createGroupDto.alarm_type,
      volume: createGroupDto.alarm_volume,
      music_title: createGroupDto.music_title,
    });
    await this.userGroupRepo.save(userGroup);

    // Subscribe the user to the group's topic
    const { alarm_end_date, alarm_day, alarm_time } = createGroupDto
    await this.alarmQueueService.addAlarmJob({ alarm_end_date, alarm_day, alarm_time }, createGroupDto.fcm_token)
    // await this.fcmService.subscribeToTopic(createGroupDto.fcm_token, group.id);
    // this.logger.log(`Group ${group.title} created and user ${user.id} subscribed to topic group-${group.id}`);

    return {
      message: 'Group created successfully and user subscribed to the topic.',
      groupId: group.id,
    };
  }

  // Join an existing group and subscribe the user to the group's topic
  public async joinGroup(joinGroupDto: JoinGroupDto): Promise<JoinGroupResponse> {
    const user = await this.userRepo.findOneBy({ id: joinGroupDto.user_id });
    if (!user) {
      throw new Error('User not found');
    }

    const group = await this.groupRepo.findOneBy({ id: joinGroupDto.group_id });
    if (!group) {
      throw new Error('Group not found');
    }

    // Create a user-group relation
    const userGroup = this.userGroupRepo.create({
      user: user,
      group: group,
    });
    await this.userGroupRepo.save(userGroup);

    // Subscribe the user to the group's topic
    await this.fcmService.subscribeToTopic(joinGroupDto.fcm_token, group.id);

    this.logger.log(`User ${user.id} joined group ${group.title} and subscribed to topic group-${group.id}`);

    return {
      message: 'User joined the group and subscribed to the topic.',
      groupId: group.id,
    };
  }

  public async editGroup(editGroupDto: EditGroupDto): Promise<GroupResponse> {
    const {user_id, group_id, is_public, max_person ,description ,title} = editGroupDto
    const userGroup = await this.userGroupRepo.findOneBy({ user_id, group_id })
    if(!userGroup.is_group_master) return { result: false, message: '그룹장이 아닙니다.'}

    const group = await this.groupRepo.findOneBy({id: group_id})
    if(!(max_person >= group.current_person)) return { result: false, message: '최대인원 설정값은 현재인원 이상으로만 변경가능합니다.'}

    const { affected } = await this.groupRepo.update(
      { id: group_id },
      { is_public, max_person, description, title }
    )
    if(affected == 0) return { result: false, message: '이전 내용과 동일합니다.' }

    return { result: true, message: '수정되었습니다.' }
  }

  public async editPersonalGroup(editPersonalDto: EditPersonalDto): Promise<GroupResponse> {
    const { user_id, group_id, music_title, alarm_type, alarm_volume } = editPersonalDto
    const userGroup = await this.userGroupRepo.findOneBy({ user_id, group_id })
    if(!userGroup) return { result: false, message: '수정 할 userGroup 데이터를 찾지 못했습니다.' }

    const { affected } = await this.userGroupRepo.update(
      { user_id, group_id },
      { music_title, alarm_type, volume: alarm_volume }
    )
    if(affected == 0) return { result: false, message: '이전 내용과 동일합니다.' }

    return { result: true, message: '수정되었습니다.' }
  }
}