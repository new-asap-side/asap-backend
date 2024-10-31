import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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