import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class DeleteUserResponse {
  @ApiProperty({ example: true, description: '성공적으로 탈퇴 처리 되면 true, 아니면 false' })
  @IsBoolean()
  result: boolean;
}