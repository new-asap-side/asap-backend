import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';
import { UserGroup } from '@src/database/entity/userGroup';
import { ReportGroupRequest } from '@src/dto/dto.admin';
import { Report } from '@src/database/entity/report';
import { Alarm } from '@src/database/entity/alarm';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: Repository<UserGroup>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    private readonly entityManager: EntityManager,
    @InjectQueue('androidAlarmQueue') private readonly androidAlarmQueue: Queue,
    @InjectQueue('iosAlarmQueue') private readonly iosAlarmQueue: Queue
  ) {}

  async softDeleteUser(userId: number, userLeaveReason: string) {
        const user = await this.userRepo.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        await this.userRepo.update(
          { user_id: userId },
          { user_leave_reason: userLeaveReason }
        )
        await this.userRepo.softRemove(user);
        return { result: true }
  }

  async getUser(userId: number) {
    return await this.userRepo.findOne({
      where: { user_id: userId },
      select: ['user_id', 'profile_image_url', 'nick_name']
    })
  }

  async reportGroup(req: ReportGroupRequest) {
    const { userId, groupId } = req
    const existingReport = await this.reportRepo.findOne({
      where: { user_id: userId , group_id: groupId }
    });
    if (existingReport) {
      return {result: false, reason: '이미신고한 그룹입니다.'}
    }

    const report = this.reportRepo.create({
      user_id: userId,
      group_id: groupId,
    });
    await this.reportRepo.save(report);

    const reportedGroups = await this.reportRepo.findBy({
      group_id: groupId,
    });

    if(reportedGroups.length >= 5) {
      await this.entityManager.transaction(async (manager)=> {
        await manager.softDelete(Group, { group_id: groupId })
        await manager.softDelete(UserGroup, { group_id: groupId })
        await manager.softDelete(Alarm, { group_id: groupId })
      })

      const userGroups = await this.userGroupRepo.find({
        where: { group_id: groupId },
        select: ['user_id']
      })
      const userIds = userGroups.map(v=>v.user_id)
      const alarm_tokens = await this.userRepo.find({
        where: { user_id: In(userIds) },
        select: ['device_token', 'fcm_token']
      })
      const iosDelayedJobs = await this.iosAlarmQueue.getDelayed()
      for (const iosDelayedJob of iosDelayedJobs) {
        for (const alarm_token of alarm_tokens) {
          if(iosDelayedJob.data?.deviceToken === alarm_token?.device_token) {
            await iosDelayedJob.remove()
          }
        }
      }
      const androidDelayedJobs = await this.androidAlarmQueue.getDelayed()
      for (const androidDelayedJob of androidDelayedJobs) {
        for (const alarm_token of alarm_tokens) {
          if(androidDelayedJob.data?.fcmToken === alarm_token?.fcm_token) {
            await androidDelayedJob.remove()
          }
        }
      }
    }

    return { result: true }
  }
}