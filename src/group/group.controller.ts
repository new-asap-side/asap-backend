import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { GroupService } from '@src/group/group.service';
import { CreateGroupDto, GroupResponse, JoinGroupDto } from '@src/dto/dto.group';

@ApiTags('group')
@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService
  ) {}

  @Post('create')
  @ApiOperation({summary: '그룹생성'})
  @ApiResponse({ status: 200, type: GroupResponse })
  async createGroup(
    @Body() createGroupDto: CreateGroupDto
  ) {
    return await this.groupService.createGroup(createGroupDto)
  }

  @Post('join')
  @ApiOperation({summary: '그룹참여'})
  @ApiResponse({ status: 200, type: GroupResponse })
  async joinGroup(
    @Body() joinGroupDto: JoinGroupDto
  ) {
    return await this.groupService.joinGroup(joinGroupDto)
  }
}