import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class DeleteUserRequest {
  @ApiProperty({ example: 1, description: '유저 ID' })
  @IsNumber()
  userId: number;
}

export class DeleteUserResponse {
  @ApiProperty({ example: true, description: '성공적으로 탈퇴 처리 되면 true, 아니면 false' })
  @IsBoolean()
  result: boolean;
}