import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@src/database/entity/user';
import { S3Service } from '@src/S3/S3.service';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly s3Service: S3Service,
  ) {
  }

  public async checkNickName(nickName: string): Promise<{ isPossible: boolean }> {
    const result = await this.userRepo.findOneBy({ nick_name: nickName })
    return { isPossible: !!!result }
  }

  public async saveProfile(user_id: number, nickName: string, profileImgBase64?: string): Promise<{ result: boolean, reason?: string, profile_image_url?: string }> {
    try {
      if(!user_id || !nickName) return{
        result: false, reason: 'user_id or nickName is empty!'
      }

      const user = await this.userRepo.findOneBy({ user_id: Number(user_id) })
      const profile_image_url = profileImgBase64 === user.profile_image_url ?
        user.profile_image_url :
        await this.s3Service.upload(profileImgBase64);

      const { affected } = await this.userRepo.update(
        { user_id: Number(user_id) },
        { nick_name: nickName, profile_image_url }
      )
      if(affected === 0) return { result: false, reason: 'user update is no affect'}
      return { result: true, profile_image_url}
    } catch (e) {
      this.logger.log(`saveProfile error, M=${e.message}`)
      return { result: false, reason: 'Internal Server Error'}
    }
  }

}