import { Injectable } from '@nestjs/common';
import { Between, EntityManager, In, Repository } from 'typeorm';
import { UserGroup } from '@src/database/entity/userGroup';
import { Rank } from '@src/database/entity/rank';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmOffRateResponse } from '@src/libs/dto/dto.alarm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '@src/database/entity/user';
import { AndroidQueueEnum, IosQueueEnum } from '@src/database/enum/queueEnum';

@Injectable()
export class AlarmService {
  constructor(
    private readonly manager: EntityManager,
    @InjectRepository(Rank)
    private readonly rankRepo: Repository<Rank>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: Repository<UserGroup>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectQueue(AndroidQueueEnum.NAME) private readonly androidAlarmQueue: Queue,
    @InjectQueue(IosQueueEnum.NAME) private readonly iosAlarmQueue: Queue
    ) {}

  async offAlarm(user_id: number, group_id: number) {
    return await this.manager.transaction(async (manager) => {
      const userGroup = await manager.findOneBy(UserGroup, { user_id, group_id })
      if (!userGroup) return { result: false, reason: 'userGroup is empty' }

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // 오늘 00:00:00
      startOfDay.setHours(startOfDay.getHours() - 9);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999); // 오늘 23:59:59
      endOfDay.setHours(endOfDay.getHours() - 9);

      const ranks = await this.manager.find(Rank, {
        where: {
          user_group_id: userGroup.user_group_id,
          created_at: Between(startOfDay, endOfDay)
        }
      })

      let rank_number = null
      if (ranks.length === 0) {
        rank_number = 1
      } else if (ranks.length === 1) {
        rank_number = 2
      } else if (ranks.length === 2) {
        rank_number = 3
      } else if (ranks.length === 3) {
        rank_number = 4
      } else if (ranks.length === 4) {
        rank_number = 5
      } else if (ranks.length === 5) {
        rank_number = 6
      } else if (ranks.length === 6) {
        rank_number = 7
      } else if (ranks.length === 7) {
        rank_number = 8
      }

      const beforeRankScore = ranks.find(v => v.user_group_id === userGroup.user_group_id)?.rank_score || 0
      const afterRankScore = beforeRankScore + (1000 - 50 * (rank_number - 1))
      await this.manager.insert(Rank, {
        user_group_id: userGroup.user_group_id,
        rank_number,
        rank_score: afterRankScore
      })

      await this.manager.increment(UserGroup,
        { user_group_id: userGroup.user_group_id },
        'alarm_unlock_count',
        1
      )

      return {result: true}
    })
  }

  async getUserAlarmUnlockRate(userId: number): Promise<AlarmOffRateResponse> {
    // 1. 특정 유저의 총 알람 횟수 (Rank 테이블에서 count)
    const totalAlarmCount = await this.rankRepo
      .createQueryBuilder('rank')
      .innerJoin('rank.userGroup', 'userGroup')
      .where('userGroup.user_id = :userId', { userId })
      .getCount();

     // 2.
    const userGroup = await this.userGroupRepo
      .createQueryBuilder('userGroup')
      .select('COUNT(userGroup.user_id)', 'joinedGroupCount')
      .where('userGroup.user_id = :userId', { userId })
      .getRawOne();

    if (totalAlarmCount === 0) {
      return {
        userId,
        offRate: 0.0,
        joinedGroupCount: Number(userGroup?.joinedGroupCount) ?? 0
      };
    }

    // 2. 특정 유저의 알람 해제수 합계 (UserGroup 테이블에서 sum)
    const result = await this.userGroupRepo
      .createQueryBuilder('userGroup')
      .select('SUM(userGroup.alarm_unlock_count)', 'totalUnlockCount')
      .where('userGroup.user_id = :userId', { userId })
      .getRawOne();

    const totalUnlockCount = result.totalUnlockCount || 0;

    // 3. Unlock Rate 계산
    const unlockRate = (Number(totalUnlockCount) / Number(totalAlarmCount)) * 100;
    return {
      userId,
      offRate: parseFloat(unlockRate.toFixed(1)),
      joinedGroupCount: Number(userGroup?.joinedGroupCount) ?? 0
    }
  }

  async removeAllAlarmJob(groupId: number) {
    const userGroups = await this.userGroupRepo.find({
        where: { group_id: groupId },
        select: ['user_id'],
        withDeleted: true
      })
      const userIds = userGroups.map(v=>v.user_id)
      const alarm_tokens = await this.userRepo.find({
        where: { user_id: In(userIds) },
        select: ['device_token', 'fcm_token'],
        withDeleted: true
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

  async removeOnlyOneAlarmJob(groupId: number, userId: number) {
    const userGroups = await this.userGroupRepo.findOne({
        where: { group_id: groupId, user_id: userId },
        select: ['user_id'],
        withDeleted: true
      })

      const alarm_token = await this.userRepo.findOne({
        where: { user_id: userGroups.user_id },
        select: ['device_token', 'fcm_token'],
        withDeleted: true
      })
      const iosDelayedJobs = await this.iosAlarmQueue.getDelayed()
      for (const iosDelayedJob of iosDelayedJobs) {
        if(iosDelayedJob.data?.deviceToken === alarm_token?.device_token) {
          await iosDelayedJob.remove()
        }
      }
      const androidDelayedJobs = await this.androidAlarmQueue.getDelayed()
      for (const androidDelayedJob of androidDelayedJobs) {
        if(androidDelayedJob.data?.fcmToken === alarm_token?.fcm_token) {
          await androidDelayedJob.remove()
        }
      }
  }
}
