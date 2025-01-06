import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class DeleteUserRequest {
  @ApiProperty({ example: 1, description: '유저 ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: '유저 탈퇴 사유' })
  @IsString()
  userLeaveReason: string;
}

export class DeleteUserResponse {
  @ApiProperty({ example: true, description: '성공적으로 탈퇴 처리 되면 true, 아니면 false' })
  @IsBoolean()
  result: boolean;
}

export class GetUserRequest {
  @ApiProperty({ example: 1, description: '유저 ID' })
  @IsString()
  userId: string;
}

export class GetUserResponse {
  @ApiProperty({ example: 1, description: '유저 ID' })
  user_id: number

  @ApiProperty({
    example: 'https://asap-data.s3.ap-northeast-2.amazonaws.com/fc47faf7-fbfd-4394-9640-42195888bbec.jpeg',
    description: '유저 프로필 이미지 url'
  })
  profile_image_url: string

  @ApiProperty({ example: '홍길동123', description: '유저 닉네임' })
  nick_name: string
}