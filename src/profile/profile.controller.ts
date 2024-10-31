import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@src/profile/profile.service';
import { CheckNickNameRequest, CheckNickNameResponse } from '@src/dto/dto.profile';
import { JwtAuthGuard } from '@src/auth/auth.guard';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService
  ) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file)
  //   // await this.objectStorageService.uploadObject();
  //   return { message: 'File uploaded successfully' };
  // }

  @Post('check-nick-name')
  @ApiOperation({summary: '닉네임 중복체크'})
  @ApiResponse({ status: 200, type: CheckNickNameResponse })
  async checkNickName(
    @Body() checkNickNameRequest: CheckNickNameRequest
  ) {
    return await this.profileService.checkNickName(checkNickNameRequest.nickName)
  }
}