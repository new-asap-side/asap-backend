import {Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entity/user';
import { Repository } from 'typeorm';

@Injectable()
export class AuthKakaoService {
    constructor(
        private readonly http: HttpService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

    ) {}

    public async kakaoLogin(apikey: string, redirectUri: string, code: string) {
        const accessToken = await this.getAccessToken(apikey, redirectUri, code);
        const kakaoId = await this.getKakaoId(accessToken);

        const kakaoUser = this.userRepo.create();
        kakaoUser.kakao_id = kakaoId;
        await this.userRepo.save(kakaoUser);

        return { kakao_id: kakaoUser.kakao_id }
    }

    private async getAccessToken(apikey: string, redirectUri: string, code: string) {
        const config = {
            grant_type: 'authorization_code',
            client_id: apikey,
            redirect_uri: redirectUri,
            code,
        };

        const params = new URLSearchParams(config).toString();
        const tokenHeaders = {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        };
        const tokenUrl = `https://kauth.kakao.com/oauth/token?`;


        const { data } = await firstValueFrom(
          this.http.post(tokenUrl, params, { headers: tokenHeaders }),
        );

        return data.access_token
    }

    private async getKakaoId(accessToken: string) {
        const userInfoUrl = `https://kapi.kakao.com/v2/user/me`;
        const userInfoHeaders = {
            Authorization: `Bearer ${accessToken}`,
        };
        const { data } = await firstValueFrom(
          this.http.get(userInfoUrl, { headers: userInfoHeaders }),
        );
        return data.id
    }

}