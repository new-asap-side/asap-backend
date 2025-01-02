import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/database/entity/user';
import { Group } from '@src/database/entity/group';
import { UserGroup } from '@src/database/entity/userGroup';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepo: Repository<UserGroup>,
  ) {}

  async softDeleteUser(userId: number) {
        const user = await this.userRepo.findOne({ where: { user_id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        await this.userRepo.softRemove(user);
        return { result: true }
  }

  // TODO: 혹시나 필요하면 사용
  async restoreUser(userId: number): Promise<void> {
      const user = await this.userRepo.findOne({
          where: { user_id: userId },
          withDeleted: true, // 삭제된 레코드 포함 조회
      });
      if (!user) {
          throw new Error(`User with ID ${userId} not found`);
      }
      user.deleted_at = null;
      await this.userRepo.save(user);
  }

  async getUser(userId: number) {
    return await this.userRepo.findOne({
      where: { user_id: userId },
      select: ['user_id', 'profile_image_url', 'nick_name']
    })
  }
}