import { Injectable } from '@nestjs/common';
import { Between, EntityManager, Repository } from 'typeorm';
import { UserGroup } from '@src/database/entity/userGroup';
import { Rank } from '@src/database/entity/rank';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/database/entity/user';

@Injectable()
export class AlarmService {
  constructor(
    private readonly manager: EntityManager,
    @InjectRepository(Rank)
    private readonly rankRepo: Repository<Rank>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: Repository<UserGroup>,
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

      const beforeRankScore = ranks.find(v => v.user_group_id === userGroup.user_group_id).rank_score
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

  async getUserAlarmUnlockRate(userId: number): Promise<number> {
    // 1. 특정 유저의 총 알람 횟수 (Rank 테이블에서 count)
    const totalAlarmCount = await this.rankRepo
      .createQueryBuilder('rank')
      .innerJoin('rank.userGroup', 'userGroup')
      .where('userGroup.user_id = :userId', { userId })
      .getCount();

    if (totalAlarmCount === 0) {
      return 0.0; // 알람 횟수가 없으면 0% 반환
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
    return parseFloat(unlockRate.toFixed(1)); // 소수점 1자리까지 반환
  }
}
