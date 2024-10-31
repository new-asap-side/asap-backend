import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/database/entity/user';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
  }

  public async checkNickName(nickName: string): Promise<{ isPossible: boolean }> {
    const result = await this.userRepo.findOneBy({ nick_name: nickName })
    return { isPossible: !!!result }
  }

  public async saveProfile(user_id: number, nickName: string, profile_img?: Express.Multer.File): Promise<{ result: boolean, reason?: string, profile_image_url?: string }> {
    try {
      console.log(profile_img)
      const { affected } = await this.userRepo.update({
        id: Number(user_id)
      },{ nick_name: nickName, profile_image_url: '' })
      if(affected === 0) return { result: false, reason: 'user_id Is Not Found'}
      return { result: true, profile_image_url: 'AWS 인프라 이전 후 구축예정입니다!' }
    } catch (e) {
      this.logger.log(`saveProfile error, M=${e.message}`)
      return { result: false, reason: 'Internal Server Error'}
    }
  }

}