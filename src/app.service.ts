import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@entity/user";
import {Repository} from "typeorm";
import {Group} from "@entity/group";
import {UserGroup} from "@entity/userGroup";

@Injectable()
export class AppService {
  constructor(
      @InjectRepository(User) private readonly userRepo: Repository<User>,
      @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
      @InjectRepository(UserGroup) private readonly userGroupRepo: Repository<UserGroup>,
  ) {
  }

  public getHealth() {
    return 'good'
  }





}
