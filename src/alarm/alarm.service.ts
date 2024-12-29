import { Injectable } from '@nestjs/common';
import { Between, EntityManager } from 'typeorm';
import { UserGroup } from '@src/database/entity/userGroup';
import { Rank } from '@src/database/entity/rank';

@Injectable()
export class AlarmService {
  constructor(
    private readonly manager: EntityManager
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
}
