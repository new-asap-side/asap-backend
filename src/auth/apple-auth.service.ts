import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AppleLoginRequest } from '../dto/dto.auth';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/database/entity/user';
import { AuthService } from '@src/auth/auth.service';


@Injectable()
export class AppleAuthService {
  private readonly logger = new Logger(AppleAuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  // identity_token 검증
  async appleLogin({ identityToken, device_token }: AppleLoginRequest): Promise<any> {
    const decodedString = Buffer.from(identityToken, 'base64').toString('utf-8');

    // JWT 토큰을 디코딩하여 확인
    const decodedToken = jwt.decode(decodedString, {complete: true });
    if (!decodedToken) throw new BadRequestException('Invalid identityToken');

    const sub = decodedToken.payload.sub as string
    const { user_id, isJoinedUser } = await this.signUpAppleUser(sub);
    const { accessToken, refreshToken } = this.authService.generateJWT(sub, user_id);
    await this.userRepo.update(user_id, {refresh_token: refreshToken, device_token})

    return {
      user_id: String(user_id),
      apple_id: sub,
      accessToken,
      refreshToken,
      isJoinedUser
    };
  }

  // 유저 정보 확인 또는 생성
  private async signUpAppleUser(apple_id: string) {
    // DB에서 사용자를 찾거나, 없으면 생성
    const appleUser = await this.userRepo.findOne({
      where: { apple_id },
      withDeleted: true
    }
    );
    if (!appleUser) {
      const appleUser = this.userRepo.create({apple_id});
      const savedUser = await this.userRepo.save(appleUser);
      return {
        user_id: savedUser.user_id,
        isJoinedUser: false
      }
    } else if(appleUser?.deleted_at) {
      appleUser.deleted_at = null
      await this.userRepo.update({apple_id}, appleUser)
      return {
        user_id: appleUser.user_id,
        isJoinedUser: true
      }
    } else {
      return {
        user_id: appleUser.user_id,
        isJoinedUser: true
      }
    }
  }
}
