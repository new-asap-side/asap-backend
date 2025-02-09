import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DeviceTypeEnum } from '@src/libs/dto/dto.group';

export class KakaoLoginRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    kakaoAccessToken: string;

    @ApiProperty({description: 'ios의 경우 device_token을 주시고, android의 경우 fcm_token을 주십쇼!'})
    @IsString()
    @IsNotEmpty()
    alarm_token: string

    @ApiProperty({
        description: 'ios, android 기기 구분자',
        enum: DeviceTypeEnum,
        example: DeviceTypeEnum.ANDROID
    })
    @IsEnum(DeviceTypeEnum)
    @IsNotEmpty()
    device_type: DeviceTypeEnum
}

export class AppleLoginRequest {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identityToken: string;

    @ApiProperty({description: 'ios만 사용하는 API니까 device_token주시면 됩니다!'})
    @IsString()
    @IsNotEmpty()
    device_token: string
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

    @ApiProperty({ example: true, description: '이미 가입된 유저인지 확인하는 필드' })
    isJoinedUser: boolean
}

export class AuthAppleResponse extends AuthTokenResponse{
    @ApiProperty({ example: '1', description: 'DB에 저장된 애플 고유 아이디 값' })
    apple_id: string;

    @ApiProperty({ example: '1', description: 'DB에 저장된 유저 고유 아이디 값' })
    user_id: string;

    @ApiProperty({ example: true, description: '이미 가입된 유저인지 확인하는 필드' })
    isJoinedUser: boolean
}