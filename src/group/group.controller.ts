import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@src/profile/profile.service';
import {
  CheckNickNameRequest,
  CheckNickNameResponse,
  SaveProfileRequest,
  SaveProfileResponse,
} from '@src/dto/dto.profile';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GroupService } from '@src/group/group.service';

@ApiTags('group')
@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService
  ) {}

  @Post('all')
  @ApiOperation({summary: '닉네임 중복체크'})
  @ApiResponse({ status: 200, type: CheckNickNameResponse })
  async checkNickName() {
    // return await this.groupService.checkNickName()
  }
}