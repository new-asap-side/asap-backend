import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AppleJwtTokenPayload, AppleLoginRequest, AuthAppleResponse } from '../dto/dto.auth';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwksClient } from 'jwks-rsa';
import { User } from '@src/entity/user';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class AppleAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  // identity_token 검증
  async appleLogin({ identityToken }: AppleLoginRequest): Promise<AuthAppleResponse> {
    const decodedToken = jwt.decode(identityToken, { complete: true }) as {
      header: { kid: string; alg: jwt.Algorithm };
      payload: { sub: string };
    };
    const keyIdFromToken = decodedToken.header.kid;
    const applePublicKeyUrl = 'https://appleid.apple.com/auth/keys';

    const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });

    const key = await jwksClient.getSigningKey(keyIdFromToken);
    const publicKey = key.getPublicKey();

    const verifiedDecodedToken: AppleJwtTokenPayload = jwt.verify(identityToken, publicKey, {
      algorithms: [decodedToken.header.alg]
    }) as AppleJwtTokenPayload;

    const user_id = await this.signUpAppleUser(verifiedDecodedToken.sub)
    const { accessToken, refreshToken } = this.authService.generateJWT(verifiedDecodedToken.sub, String(user_id))

    return {
      user_id: String(user_id),
      apple_id: verifiedDecodedToken.sub,
      accessToken,
      refreshToken
    }
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
      return savedUser.id
    }
    return user.id
  }
}
