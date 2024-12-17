import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { GroupService } from '@src/group/group.service';
import {
  CreateGroupDto,
  EditGroupDto,
  EditPersonalDto,
  GroupResponse,
  JoinGroupDto,
  CreateGroupResponse, JoinGroupResponse, RemovePersonalDto, ReadGroupResponseDto,
} from '@src/dto/dto.group';
import { Group } from '@src/database/entity/group';

@ApiTags('group')
@Controller('group')
// @UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService
  ) {}

  @Get('latest')
  @ApiOperation({summary: '최신그룹 전체조회'})
  @ApiResponse({ status: 200, type: ReadGroupResponseDto, isArray: true })
  async getAllGroup(
  ) {
    return await this.groupService.getAllGroup()
  }

  @Get('popular')
  @ApiOperation({summary: '인기그룹 전체조회'})
  @ApiResponse({ status: 200, type: ReadGroupResponseDto, isArray: true })
  async getPopularGroup(
  ) {
    return await this.groupService.getPopularGroup()
  }

  @Post('create')
  @ApiOperation({summary: '그룹 생성'})
  @ApiResponse({ status: 200, type: CreateGroupResponse })
  async createGroup(
    @Body() createGroupDto: CreateGroupDto
  ) {
    return await this.groupService.createGroup(createGroupDto)
  }

  @Post('join')
  @ApiOperation({summary: '그룹 참여'})
  @ApiResponse({ status: 200, type: JoinGroupResponse })
  async joinGroup(
    @Body() joinGroupDto: JoinGroupDto
  ) {
    return await this.groupService.joinGroup(joinGroupDto)
  }

  @Post('edit')
  @ApiOperation({summary: '그룹 수정[그룹장 권한]'})
  @ApiResponse({ status: 200, type: GroupResponse })
  async editGroup(
    @Body() editGroupDto: EditGroupDto
  ) {
    return await this.groupService.editGroup(editGroupDto)
  }

  @Post('edit-personal')
  @ApiOperation({summary: '개인 설정 수정[그룹원, 그룹장 권한]'})
  @ApiResponse({ status: 200, type: GroupResponse })
  async editPersonalGroup(
    @Body() editPersonalDto: EditPersonalDto
  ) {
    return await this.groupService.editPersonalGroup(editPersonalDto)
  }

  @Delete('remove')
  @ApiOperation({summary: '그룹 탈퇴'})
  @ApiResponse({ status: 200, type: GroupResponse })
  async removePersonalGroup(
    @Body() removePersonalDto: RemovePersonalDto
  ) {
    return await this.groupService.removePersonalGroup(removePersonalDto)
  }
}