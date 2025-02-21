import { Body, Controller, Logger, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    AppleLoginRequest, AuthAppleResponse,
    AuthKakaoResponse, AuthTokenResponse, KakaoLoginRequest,
} from '@src/libs/dto/dto.auth';
import {KakaoAuthService} from '@src/auth/kakao-auth.service';
import {ConfigService} from "@nestjs/config";
import { AppleAuthService } from '@src/auth/apple-auth.service';
import { AuthService } from '@src/auth/auth.service';
import { JwtRefreshGuard } from '@src/auth/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
      private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authKakao: KakaoAuthService,
        private readonly authApple: AppleAuthService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {}

    @Post('kakao')
    @ApiOperation({summary: '카카오 로그인 및 회원가입 요청'})
    @ApiResponse({ status: 200, type: AuthKakaoResponse, description: 'kakao login success!' })
    async getKakaoInfo(@Body() req: KakaoLoginRequest): Promise<AuthKakaoResponse> {
        return await this.authKakao.kakaoLogin(req)
    }

    @Post('apple')
    @ApiOperation({ summary: '애플 로그인 및 회원가입 요청' })
    @ApiResponse({ status: 200, type: AuthAppleResponse, description: 'apple login success!' })
    async appleLogin(@Body() appleLoginRequest: AppleLoginRequest): Promise<AuthAppleResponse> {
        return await this.authApple.appleLogin(appleLoginRequest);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Access 토큰이 만료시 호출' })
    @ApiResponse({
        status: 201,
        description: '새로운 Access 토큰과 Refresh 토큰을 응답',
        type: AuthTokenResponse
    })
    @UseGuards(JwtRefreshGuard)
    async refreshToken(@Req() req: Request) {
        const { refreshToken } = req['user']
        const user = await this.authService.findByIdAndCheckRT(refreshToken);

        if(!user) {
            this.logger.warn(`refreshToken: ${refreshToken} is user empty`)
            throw new UnauthorizedException();
        }

        const platform_id = user?.kakao_id ? user.kakao_id : user.apple_id
        const token = this.authService.generateJWT(platform_id, user.user_id);

        await this.authService.updateRefreshToken(user.user_id, token.refreshToken);

        return {
            user_id: String(user.user_id),
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        }
    }

}
