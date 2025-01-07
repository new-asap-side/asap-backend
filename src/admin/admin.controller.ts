import { Controller, Body, Get, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from '@src/admin/admin.service';
import { DeleteUserRequest, DeleteUserResponse, GetUserRequest, GetUserResponse } from '@src/dto/dto.admin';

@ApiTags('admin')
@Controller('admin')
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
  async getUser(@Param('user_id') user_id: string) {
    return await this.adminService.getUser(Number(user_id))
  }
}