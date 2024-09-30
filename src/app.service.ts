import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@entity/User";
import {Repository} from "typeorm";
import {Group} from "@entity/Group";
import {UserGroup} from "@entity/UserGroup";
import {Setting} from "@entity/Setting";

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(User) private readonly userRepo: Repository<User>,
      @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
      @InjectRepository(UserGroup) private readonly userGroupRepo: Repository<UserGroup>,
      @InjectRepository(Setting) private readonly settingRepo: Repository<Setting>,
  ) {
  }

  public getHealth() {
    return 'good'
  }

}
