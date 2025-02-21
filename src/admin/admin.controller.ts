import { Controller, Body, Get, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from '@src/admin/admin.service';
import {
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserResponse,
  ReportGroupRequest, ReportGroupResponse,
} from '@src/libs/dto/dto.admin';
import { JwtAccessGuard } from '@src/auth/auth.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAccessGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  @Delete('user')
  @ApiOperation({summary: '유저 회원탈퇴'})
  @ApiResponse({ status: 200, type: DeleteUserResponse })
  async deleteUser(@Body() req: DeleteUserRequest) {
    return await this.adminService.softDeleteUser(req.userId, req.userLeaveReason)
  }

  @Get(':user_id')
  @ApiOperation({summary: '유저 정보조회'})
  @ApiParam({ name: 'user_id', description: '유저 ID', required: true, type: String })
  @ApiResponse({ status: 200, type: GetUserResponse })
  async getUser(@Param() req: { user_id: string }) {
    console.warn(JSON.stringify(req))
    return await this.adminService.getUser(Number(req.user_id))
  }

  @Post('Report')
  @ApiOperation({summary: '특정 그룹 신고기능, 5회 누적시 해당 그룹 삭제'})
  @ApiResponse({ status: 200, type: ReportGroupResponse })
  async reportGroup(@Body() req: ReportGroupRequest) {
    return await this.adminService.reportGroup(req)
  }
}