import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class KakaoLoginRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    kakaoAccessToken: string;
}

export class AppleLoginRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identityToken: string;
}

export class AuthTokenResponse {
    @ApiProperty({ example: 'aaa.bbb.ccc', description: 'jwt access 토큰' })
    accessToken: string;

    @ApiProperty({ example: 'aaa.bbb.ccc', description: 'jwt refresh 토큰' })
    refreshToken: string;
}

export class AuthKakaoResponse extends AuthTokenResponse{
    @ApiProperty({ example: '1', description: 'DB에 저장된 카카오 고유 아이디 값' })
    kakao_id: string;

    @ApiProperty({ example: '1', description: 'DB에 저장된 유저 고유 아이디 값' })
    user_id: string;
}

export class AuthAppleResponse extends AuthTokenResponse{
    @ApiProperty({ example: '1', description: 'DB에 저장된 애플 고유 아이디 값' })
    apple_id: string;

    @ApiProperty({ example: '1', description: 'DB에 저장된 유저 고유 아이디 값' })
    user_id: string;
}