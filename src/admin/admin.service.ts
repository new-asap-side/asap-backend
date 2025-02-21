import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';
import { UserGroup } from '@src/database/entity/userGroup';
import { ReportGroupRequest } from '@src/libs/dto/dto.admin';
import { Report } from '@src/database/entity/report';
import { Alarm } from '@src/database/entity/alarm';
import { AlarmService } from '@src/alarm/alarm.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    private readonly entityManager: EntityManager,
    private readonly alarmService: AlarmService
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
        await this.userRepo.softDelete(user);
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
      reportDetailText: req?.reportDetailText ?? 'EMPTY'
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

      await this.alarmService.removeAllAlarmJob(groupId)
    }

    return { result: true }
  }
}