import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckNickNameResponse,
} from '@src/dto/dto.profile';
import { AdminService } from '@src/admin/admin.service';
import { DeleteUserRequest, DeleteUserResponse } from '@src/dto/dto.admin';

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
    return await this.adminService.softDeleteUser(req.userId)
  }
}