import { Injectable, Logger } from '@nestjs/common';
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthKakaoResponse } from '../dto/dto.auth';
import { User } from '@src/database/entity/user';
import { AuthService } from '@src/auth/auth.service';

@Injectable()
export class KakaoAuthService {
    private readonly logger = new Logger(KakaoAuthService.name);

    constructor(
        private readonly http: HttpService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly authService: AuthService,
    ) {}

    public async kakaoLogin(kakaoAccessToken: string): Promise<AuthKakaoResponse> {
        try {
            const kakao_id = await this.getKakaoId(kakaoAccessToken);
            const user_id = await this.signUpKakaoUser(kakao_id)
            const { accessToken, refreshToken } = this.authService.generateJWT(kakao_id, String(user_id))
            await this.userRepo.update(user_id, {refresh_token: refreshToken})

            return {
                user_id: String(user_id),
                kakao_id,
                accessToken,
                refreshToken
            }
        } catch (e) {
            this.logger.error(`kakaoLogin error, M=${e?.message}, S=${e?.stack}`)
        }
    }

    public async signUpKakaoUser(kakao_id: string) {
        const kakaoUser = await this.userRepo.findOne({
            where:{ kakao_id },
            withDeleted: true
        });
        if(!kakaoUser) {
            const kakaoUserEntity = this.userRepo.create({kakao_id});
            const savedUser = await this.userRepo.save(kakaoUserEntity);
            return savedUser.user_id
        } else if(kakaoUser?.deleted_at) {
            kakaoUser.deleted_at = null;
            await this.userRepo.update({kakao_id}, kakaoUser);
            return kakaoUser.user_id
        } else {
            return kakaoUser.user_id
        }
    }

    private async getKakaoId(kakaoAccessToken: string) {
        const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
        const userInfoHeaders = {
            Authorization: `Bearer ${kakaoAccessToken}`,
        };
        const { data } = await firstValueFrom(
          this.http.get(userInfoUrl, { headers: userInfoHeaders }),
        );
        return data.id
    }
}