import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@src/profile/profile.service';
import {
  CheckNickNameRequest,
  CheckNickNameResponse,
  SaveProfileRequest,
  SaveProfileResponse,
} from '@src/dto/dto.profile';
import { JwtAccessGuard } from '@src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAccessGuard)
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

  @Post('save-profile')
  @ApiOperation({ summary: '프로필 저장' })
  @ApiResponse({ status: 201, type: SaveProfileResponse })
  async saveProfile(
    @Body() saveProfileRequest: SaveProfileRequest,
  ) {
    const { userId, nickName, profileImgBase64 } = saveProfileRequest;

    // profileService로 base64 이미지와 함께 데이터 전달
    return await this.profileService.saveProfile(userId, nickName, profileImgBase64);
  }
}