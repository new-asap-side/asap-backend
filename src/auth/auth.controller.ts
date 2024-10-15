import { Body, Controller, Get, Header, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    AppleLoginRequest, AuthAppleResponse,
    AuthKakaoResponse, AuthTokenResponse,
} from 'src/dto/dto.auth';
import {KakaoAuthService} from '@src/auth/kakao-auth.service';
import {Response} from "express";
import {ConfigService} from "@nestjs/config";
import { AppleAuthService } from '@src/auth/apple-auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@src/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authKakao: KakaoAuthService,
        private readonly authApple: AppleAuthService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {}

    @Get('kakao-login-page')
    @ApiOperation({summary: '카카오 로그인 페이지 요청'})
    @Header('Content-Type', 'text/html')
    async kakaoRedirect(@Res() res: Response): Promise<void> {
        const KAKAO_API_KEY = this.configService.get<string>('KAKAO_API_KEY');
        const CODE_REDIRECT_URI = this.configService.get<string>('CODE_REDIRECT_URI');
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_API_KEY}&redirect_uri=${CODE_REDIRECT_URI}`;
        res.redirect(url)
    }

    @Get('kakao')
    @ApiOperation({summary: '카카오 로그인 페이지 요청 후 리디렉션되는 라우터'})
    @ApiResponse({ status: 200, type: AuthKakaoResponse, description: 'kakao login success!' })
    async getKakaoInfo(
        @Query() query: {code: string},
    ): Promise<AuthKakaoResponse> {
        const apikey = this.configService.get<string>('KAKAO_API_KEY');
        const redirectUri = this.configService.get<string>('CODE_REDIRECT_URI');
        const { code } = query
        return await this.authKakao.kakaoLogin(apikey, redirectUri, code)
    }

    @Post('apple')
    @ApiOperation({ summary: '애플 로그인 및 회원가입 요청' })
    @ApiResponse({ status: 200, type: AuthAppleResponse, description: 'apple login success!' })
    appleLogin(
        @Body() appleLoginRequest: AppleLoginRequest,
    ): Promise<AuthAppleResponse> {
        return this.authApple.appleLogin(appleLoginRequest);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Access 토큰이 만료시 호출' })
    @ApiResponse({
        status: 201,
        description: '새로운 Access 토큰과 Refresh 토큰을 응답',
        type: AuthTokenResponse
    })
    @UseGuards(AuthGuard('jwt-refresh'))
    async refreshToken(@Req() req: Request) {
        const { refreshToken, user_id, platform_id } = req['user']

        const user = await this.authService.findByIdAndCheckRT(user_id, refreshToken);
        const token = this.authService.generateJWT(user_id, platform_id);

        await this.authService.updateHashedRefreshToken(user.id, refreshToken);

        return {
            user_id: String(user.id),
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        }
    }

}
