import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {IsAllowedNickName} from "../decorator/validation.nick-name";

export class AppleLoginRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identityToken: string;
}

export class VerificationRequest {
    @ApiProperty()
    nickName: string;
}

export class AppleJwtTokenPayload {
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    nonce: string;
    c_hash: string;
    email?: string;
    email_verified?: string;
    is_private_email?: string;
    auth_time: number;
    nonce_supported: boolean;
}

export class UserInfoDto {
    @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
    id: number;

    @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
    name: string;

    @ApiProperty({ example: 'johndoe', description: 'The nickname of the user' })
    nickName: string;

    @ApiProperty({ example: '3415704360', description: 'The Kakao ID of the user' })
    kakaoId: string;

    @ApiProperty({ example: '3415704360', description: 'The Apple ID of the user' })
    appleId: string;

    @ApiProperty({ example: 'https://asap-imges.s3.ap-northeast-2.amazonaws.com/profile/test.jpeg', description: `The URL of the user's profile image` })
    profileImgUrl: string;

    @ApiProperty({ example: 1, description: 'The level of the user' })
    level: number;

    @ApiProperty({ example: 100, description: 'The experience points of the user' })
    exp: number;

    @ApiProperty({ example: new Date(), description: 'The creation date of the user' })
    createdAt: Date;

    @ApiProperty({ example: new Date(), description: 'The last update date of the user' })
    updatedAt: Date;
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

export enum NickNameStatusType {
    DUPLICATION = 'DUPLICATION',
    AVAILABLE = 'AVAILABLE',
    INVALID = 'INVALID',
}

export class VerificationResponse {
    @ApiProperty({ enum: NickNameStatusType, description: 'The result of nickname verification' })
    @IsNotEmpty()
    @IsAllowedNickName()
    @IsEnum(NickNameStatusType)
    checkResult: NickNameStatusType;
}

export class IdentityTokenHeader {
    kid: string;
    alg: string;
}
