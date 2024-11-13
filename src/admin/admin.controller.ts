import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckNickNameResponse,
} from '@src/dto/dto.profile';
import { AdminService } from '@src/admin/admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  @Post('all')
  @ApiOperation({summary: '닉네임 중복체크'})
  @ApiResponse({ status: 200, type: CheckNickNameResponse })
  async checkNickName() {
    // return await this.groupService.checkNickName()
  }
}