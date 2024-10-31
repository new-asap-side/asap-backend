import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckNickNameRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickName: string
}

export class CheckNickNameResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPossible: boolean
}

export class SaveProfileRequest {
  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  userId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickName: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile Image'
  })
  profile_img: any;
}

export class SaveProfileResponse {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  result: boolean

  @ApiProperty()
  reason?: string

  @ApiProperty()
  profile_image_url?: string
}