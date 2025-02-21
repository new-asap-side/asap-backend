import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';
import { UserGroup } from '@src/database/entity/userGroup';
import {
  CreateGroupDto,
  EditGroupDto,
  EditPersonalDto, GroupRankListResponseDto,
  GroupResponse,
  JoinGroupDto,
  JoinGroupResponse, RemovePersonalDto,
} from '@src/libs/dto/dto.group';
import { AlarmQueueService } from '@src/alarm/alarm.queue.service';
import { Alarm } from '@src/database/entity/alarm';
import { S3Service } from '@src/S3/S3.service';
import { GroupStatusEnum } from '@src/database/enum/groupStatusEnum';
import { AlarmDayEnum } from '@src/database/enum/alarmDaysEnum';
import { Rank } from '@src/database/entity/rank';
import { AlarmPayload } from '@src/libs/dto/dto.fcm_apns';
import { AlarmService } from '@src/alarm/alarm.service';

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
    @InjectRepository(Rank)
    private readonly rankRepo: Repository<Rank>,
    private readonly alarmQueueService: AlarmQueueService,
    private readonly s3Service: S3Service,
    private readonly manager: EntityManager,
    private readonly alarmService: AlarmService,
  ) {}

  public async getUserGroupAndAlarmInfo(userId: number) {
    const result = await this.userGroupRepo
      .createQueryBuilder('userGroup')
      .leftJoinAndSelect('userGroup.group', 'group')
      .leftJoinAndSelect('group.alarm_days', 'alarm') // 그룹과 알람 정보를 조인
      .where('userGroup.user_id = :userId', { userId }) // 조건: 특정 user_id에 해당하는 그룹
      .select([
        'userGroup.group_id',
        'group.title',
        'group.description',
        'group.alarm_end_date',
        'group.alarm_time',
        'alarm.alarm_day',
      ])
      .getMany();

    const parsedData = result.map(item => ({
      group_id: item.group_id,
      group: {
        ...item.group,
        alarm_days: item.group.alarm_days.map(alarm => alarm.alarm_day) // alarm_days를 요일 string 배열로 변환
      }
    }));

    return parsedData;
  }

  public async getGroupRankList(group_id: number): Promise< GroupRankListResponseDto[] > {
  const qb = this.rankRepo
    .createQueryBuilder('rank')
    .leftJoin('rank.userGroup', 'ug')
    .leftJoin('ug.user', 'u')
    .select([
      'u.profile_image_url AS profileImgUrl',
      'u.nick_name AS nickName',
      'rank.rank_number AS rankNumber',
      'rank.rank_score AS rankScore',
    ])
    .where(qb => {
      const subQuery = qb.subQuery()
        .select('MAX(r2.created_at)')
        .from(Rank, 'r2')
        .where('r2.user_group_id = rank.user_group_id')
        .getQuery();
      return `rank.created_at = ${subQuery}`;
    })
    .andWhere('ug.group_id = :group_id', { group_id })
    .orderBy('rank.rank_number', 'ASC');

  const userGroup = await this.userGroupRepo.findOneBy({ group_id });
  if (userGroup) {
    await this.userRepo.increment(
      { user_id: userGroup.user_id },
      'ranking_page_view_count',
      1
    );
  }

  return await qb.getRawMany();
}

  public async getGroupRankNumber(group_id: number, user_id: number) {
    const userGroup = await this.userGroupRepo.findOne({
      where: { group_id, user_id }
    })

    const result = await this.rankRepo.findOne({
      where: { user_group_id: userGroup.user_group_id },
      order: { rank_id: 'DESC' },
      select: ['rank_number'],
    });

    if(!result) return { rank_number: 1 };

    return result
  }

  public async getAllGroup() {
    const groups = await this.groupRepo.find({
      order: { created_at: 'DESC' },
      relations: { alarm_days: true }
    })

    return groups.map(group => {
      return {
        ...group,
        alarm_days: group.alarm_days.map(v => v.alarm_day)
      }
    })
  }

  public async getPopularGroup() {
    const groups =  await this.groupRepo.find({
      order: { view_count: 'DESC' },
      relations: { alarm_days: true }
    })

    return groups.map(group => {
      return {
        ...group,
        alarm_days: group.alarm_days.map(v => v.alarm_day)
      }
    })
  }

  public async getDetailGroup(group_id: number, user_id: number) {
    return await this.manager.transaction(async (manager) => {
      // view_count 증가
      await manager
        .createQueryBuilder()
        .update('group')
        .set({ view_count: () => 'view_count + 1' })
        .where('group_id = :group_id', { group_id })
        .execute();

      const userGroup = await manager.findOne(
        UserGroup,
        {
          where: {user_id, group_id },
          select: ['user_group_id']
        })

      // 그룹 상세 정보 조회
      const result =  await manager
        .createQueryBuilder(Group, 'group')
        .leftJoinAndSelect('group.userGroups', 'userGroup')
        .leftJoinAndSelect('group.alarm_days', 'alarmDays')
        .leftJoinAndSelect('userGroup.user', 'user')
        .select([
          'group.group_id',
          'group.title',
          'group.description',
          'group.max_person',
          'group.current_person',
          'group.is_public',
          'group.alarm_end_date',
          'group.alarm_time',
          'group.view_count',
          'group.group_thumbnail_image_url',
          'group.status',
          'group.alarm_unlock_contents',
          'userGroup.user_id',
          'userGroup.music_title',
          'userGroup.volume',
          'userGroup.alarm_type',
          'userGroup.is_group_master',
          'alarmDays.alarm_day',
          'user.nick_name',
          'user.profile_image_url',
        ])
        .where('group.group_id = :group_id', { group_id })
        .getOne();

      return {
        ...result,
        alarm_days: result.alarm_days.map(v => v.alarm_day),
        isJoinedUser: !!userGroup
      }
  });
}

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

    // user-group 관계 생성
    const userGroup = this.userGroupRepo.create({
      user: user,
      group: savedGroup,
      alarm_type: createGroupDto.alarm_type,
      volume: createGroupDto.alarm_volume,
      music_title: createGroupDto.music_title,
      is_group_master: true
    });
    const savedUserGroup = await this.userGroupRepo.save(userGroup);

    for (const alarmDay of createGroupDto.alarm_days) {
      const alarm = this.alarmRepo.create({
        alarm_day: alarmDay,
        group_id: savedGroup.group_id
      })
      await this.alarmRepo.save(alarm);
      await this.emitAlarmQueue(savedGroup, createGroupDto, alarmDay, {
        group_id: String(savedGroup.group_id),
        alarm_type: savedUserGroup.alarm_type,
        alarm_unlock_contents: savedGroup.alarm_unlock_contents,
        group_title: savedGroup.title,
        music_title: savedUserGroup.music_title,
        music_volume: String(savedUserGroup.volume)
      })
    }



    return {
      message: 'Group created successfully and user subscribed to the topic.',
      groupId: savedGroup.group_id,
    };
  }

  // Join an existing group and subscribe the user to the group's topic
  public async joinGroup(joinGroupDto: JoinGroupDto): Promise<JoinGroupResponse> {
    const user = await this.userRepo.findOneBy({ user_id: joinGroupDto.user_id });
    if (!user) {
      throw new NotFoundException();
    }

    const isDuplicatedUser = await this.userGroupRepo.findOne({
      where: { user_id: joinGroupDto.user_id, group_id: joinGroupDto.group_id },
    });
    if(isDuplicatedUser) throw new BadRequestException();

    const group = await this.groupRepo.findOne({
      where: { group_id: joinGroupDto.group_id },
      relations: ['alarm_days']
    });
    if (!group) {
      throw new NotFoundException();
    }
    if(!group.is_public && group.group_password) {
      if(group.group_password !== joinGroupDto.group_password) {
        throw new BadRequestException();
      }
    }

    await this.groupRepo.increment(
      {group_id: joinGroupDto.group_id},
      'current_person',
      1
    )

    // Create a user-group relation
    const userGroup = this.userGroupRepo.create({ user, group });
    const savedUserGroup = await this.userGroupRepo.save(userGroup);


    console.log(`##savedUserGroup##: ${JSON.stringify(savedUserGroup)}`)

    for (const alarmDay of group.alarm_days) {
      await this.emitAlarmQueue(
        group,
        joinGroupDto,
        alarmDay.alarm_day,
        {
          group_id: String(savedUserGroup.group_id),
          alarm_type: savedUserGroup.alarm_type,
          alarm_unlock_contents: group.alarm_unlock_contents,
          group_title: group.title,
          music_title: savedUserGroup.music_title,
          music_volume: String(savedUserGroup.volume)
        }
      )
    }

    this.logger.log(`User ${user.user_id} joined group ${group.title} and subscribed to topic group-${group.group_id}`);

    return {
      message: 'User joined the group and scheduling to the alarm.',
      groupId: group.group_id,
    };
  }

  public async editGroup(editGroupDto: EditGroupDto): Promise<GroupResponse> {
    const { user_id, group_id, is_public, max_person ,description ,title, alarm_unlock_contents, base64_group_img } = editGroupDto
    if(!user_id || !group_id) return { result: false, message: 'user_id 혹은 group_id 값이 없습니다.' }
    if(!is_public && !editGroupDto?.group_password) return { result: false, message: '비밀번호를 설정해야힙니다.' }

    const userGroup = await this.userGroupRepo.findOneBy({ user_id, group_id })
    if(!userGroup.is_group_master) return { result: false, message: '그룹장이 아닙니다.'}

    const group = await this.groupRepo.findOneBy({group_id: group_id})
    if(!(max_person >= group.current_person)) return { result: false, message: '최대인원 설정값은 현재인원 이상으로만 변경가능합니다.' }

    const group_thumbnail_image_url =
      base64_group_img === group.group_thumbnail_image_url ?
      group.group_thumbnail_image_url : await this.s3Service.upload(base64_group_img)
    const updateEntity = {
      is_public,
      max_person,
      description,
      title,
      alarm_unlock_contents,
      group_thumbnail_image_url,
      group_password: group.group_password
    }
    if(editGroupDto?.group_password) updateEntity.group_password = editGroupDto.group_password

    await this.groupRepo.update({ group_id }, updateEntity)
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

    if(userGroup?.is_group_master) {
      await this.manager.transaction(async (manager) => {
        const users = await manager.findBy(UserGroup, { group_id })
        if(users.length === 0) {
          await manager.softDelete(Group, {group_id})
        } else if(users.length === 1) {
          await this.removeOnlyOneUser(user_id, group_id, manager);
          await manager.softDelete(Group, {group_id})
        } else {
          const selectedUser = users.find(user => !user.is_group_master)
          await this.manager.update(
            UserGroup,
            { user_id: selectedUser.user_id, group_id },
            { is_group_master: true }
          )
          await this.removeOnlyOneUser(user_id, group_id, manager)
        }
      })
    } else {
      await this.manager.transaction(async (manager) => {
        await this.removeOnlyOneUser(user_id, group_id, manager)
      })
    }

    await this.alarmService.removeOnlyOneAlarmJob(userGroup.group_id, userGroup.user_id)

    return { result: true, message: '삭제되었습니다.' }
  }

  private async removeOnlyOneUser(user_id: number, group_id: number, manager: EntityManager) {
    await manager.softDelete(UserGroup, { user_id, group_id })
    await manager.decrement(
      Group,
      { group_id },
      'current_person',
      1
    )
  }

  private async emitAlarmQueue(
    group: Group,
    joinGroupDto: JoinGroupDto | CreateGroupDto,
    alarmDay: AlarmDayEnum,
    alarmPayload: AlarmPayload
  ) {
    const {alarm_end_date, alarm_time, alarm_unlock_contents} = group
      await this.alarmQueueService.addAlarmJob(
        {
          alarm_end_date,
          alarm_day: alarmDay,
          alarm_time,
          alarm_unlock_contents
        },
        joinGroupDto.device_token,
        joinGroupDto.device_type,
        alarmPayload
      )
  }
}