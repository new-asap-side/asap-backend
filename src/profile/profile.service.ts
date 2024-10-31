import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/database/entity/user';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
  }

  public async checkNickName(nickName: string): Promise<{ isPossible: boolean }> {
    const result = await this.userRepo.findOneBy({ nick_name: nickName })
    return { isPossible: !!!result }
  }
}