import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class AlarmOffResponse {
    @ApiProperty({ example: true, description: '성공적으로 해제처리 되면 true, 아니면 false' })
    @IsBoolean()
    result: boolean;
}

export class AlarmOffRequest {
    @ApiProperty({ example: 1, description: '유저 ID' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 1, description: '그룹 ID' })
    @IsNumber()
    @IsNotEmpty()
    groupId: number;
}