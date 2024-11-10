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

  ) {
  }


  public async createGroup() {

  }
}