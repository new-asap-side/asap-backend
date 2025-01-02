import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupService } from '@src/group/group.service';
import {
  CreateGroupDto,
  EditGroupDto,
  EditPersonalDto,
  GroupResponse,
  JoinGroupDto,
  CreateGroupResponse,
  JoinGroupResponse,
  RemovePersonalDto,
  GroupRankListResponseDto,
  GroupDetailsResponseDto,
  AlarmListResponseDto,
  GroupRankNumberResponseDto,
} from '@src/dto/dto.group';
import { JwtAccessGuard } from '@src/auth/auth.guard';

@ApiTags('group')
@Controller('group')
@UseGuards(JwtAccessGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService
  ) {}

  @Get('user/:user_id')
  @ApiOperation({summary: '알람 리스트 조회'})
  @ApiParam({ name: 'user_id', description: '유저 ID', required: true, type: String })
  @ApiResponse({ status: 200, type: AlarmListResponseDto, isArray: true })
  async getUserGroupAndAlarmInfo(
    @Param('user_id') userId: string,
  ) {
    return await this.groupService.getUserGroupAndAlarmInfo(Number(userId))
  }

  @Get('rank/:group_id')
  @ApiOperation({summary: '그룹 랭킹페이지 조회'})
  @ApiParam({ name: 'group_id', description: '그룹 ID', required: true, type: String })
  @ApiResponse({ status: 200, type: GroupRankListResponseDto, isArray: true })
  async getGroupRankList(
    @Param('group_id') groupId: string,
  ) {
    return await this.groupService.getGroupRankList(Number(groupId))
  }

  @Get('rank/:group_id/:user_id')
  @ApiOperation({summary: '특정 그룹의 특정유저 랭킹 순위 조회'})
  @ApiParam({ name: 'group_id', description: '그룹 ID', required: true, type: String })
  @ApiParam({ name: 'user_id', description: '유저 ID', required: true, type: String })
  @ApiResponse({ status: 200, type: GroupRankNumberResponseDto, isArray: true })
  async getGroupRankNumber(
    @Param('group_id') groupId: string,
    @Param('user_id') userId: string,
  ) {
    return await this.groupService.getGroupRankNumber(Number(groupId), Number(userId))
  }

  @Get('latest')
  @ApiOperation({summary: '최신그룹 전체조회'})
  @ApiResponse({ status: 200, type: GroupRankListResponseDto, isArray: true })
  async getAllGroup(
  ) {
    return await this.groupService.getAllGroup()
  }

  @Get('popular')
  @ApiOperation({summary: '인기그룹 전체조회'})
  @ApiResponse({ status: 200, type: GroupRankListResponseDto, isArray: true })
  async getPopularGroup(
  ) {
    return await this.groupService.getPopularGroup()
  }

  @Get(':group_id')
  @ApiOperation({ summary: '특정 그룹 상세조회' })
  @ApiParam({ name: 'group_id', description: '그룹 ID', required: true, type: String })
  @ApiResponse({ status: 200, type: GroupDetailsResponseDto })
  async getDetailGroup(
    @Param('group_id') groupId: string,
  ) {
    return await this.groupService.getDetailGroup(Number(groupId));
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