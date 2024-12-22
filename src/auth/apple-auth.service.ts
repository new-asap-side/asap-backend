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
  async appleLogin({ identityToken }: AppleLoginRequest): Promise<any> {
    const decodedString = Buffer.from(identityToken, 'base64').toString('utf-8');

    // JWT 토큰을 디코딩하여 확인
    const decodedToken = jwt.decode(decodedString, {complete: true });
    if (!decodedToken) throw new BadRequestException('Invalid identityToken');

    const sub = decodedToken.payload.sub as string
    const user_id = await this.signUpAppleUser(sub);
    const { accessToken, refreshToken } = this.authService.generateJWT(sub, String(user_id));
    await this.userRepo.update(user_id, {refresh_token: refreshToken})

    return {
      user_id: String(user_id),
      apple_id: sub,
      accessToken,
      refreshToken,
    };
  }

  // 유저 정보 확인 또는 생성
  private async signUpAppleUser(apple_id: string) {
    // DB에서 사용자를 찾거나, 없으면 생성
    const user = await this.userRepo.findOne({
      where: {
        apple_id
      }}
    );
    if (!user) {
      const appleUser = this.userRepo.create();
      appleUser.apple_id = apple_id
      const savedUser = await this.userRepo.save(appleUser);
      return savedUser.user_id
    }
    return user.user_id
  }
}
