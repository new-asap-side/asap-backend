import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {IsAllowedNickName, NickNameValidator} from "../decorator/validation.nick-name";

// export class KakaoLoginRequest {
//     @ApiProperty()
//     code: string;
// }

export class AppleLoginRequest {
    @ApiProperty()
    appleId: string;
}

export class VerificationRequest {
    @ApiProperty()
    nickName: string;
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

export class SignupResponse {
    @ApiProperty({ example: true, description: 'Indicates if the login was successful' })
    isLoginSuccess: boolean;

    @ApiPropertyOptional({ example: true, description: 'Indicates if the registration was successful' })
    isRegistSuccess?: boolean;

    @ApiProperty({ example: true, description: 'Indicates if the user is new' })
    isNewUser: boolean;

    @ApiPropertyOptional({ type: UserInfoDto, description: 'The information of the user' })
    userInfo?: UserInfoDto;
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
