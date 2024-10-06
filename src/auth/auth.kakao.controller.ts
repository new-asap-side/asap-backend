import {Body, Controller, Get, Header, Post, Query, Res} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    AppleLoginRequest,
    SignupResponse,
    VerificationRequest,
    VerificationResponse,
} from 'src/dto/dto.auth';
import {AuthKakaoService} from "./auth.kakao.service";
import {Response} from "express";
import {ConfigService} from "@nestjs/config";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authKakaoSerive: AuthKakaoService,
        // private readonly AuthApple: AuthAppleService,
        private readonly configService: ConfigService
    ) {}

    @Get('kakao-login-page')
    @Header('Content-Type', 'text/html')
    async kakaoRedirect(@Res() res: Response): Promise<void> {
        const KAKAO_API_KEY = this.configService.get<string>('KAKAO_API_KEY');
        const CODE_REDIRECT_URI = this.configService.get<string>('CODE_REDIRECT_URI');
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_API_KEY}&redirect_uri=${CODE_REDIRECT_URI}`;
        res.redirect(url)
    }

    @Get('kakao')
    @ApiResponse({ status: 200, type: SignupResponse, description: 'kakao login success!' })
    async getKakaoInfo(
        @Query() query: {code: string},
    ): Promise<any> {
        const apikey = this.configService.get<string>('KAKAO_API_KEY');
        const redirectUri = this.configService.get<string>('CODE_REDIRECT_URI');
        const { code } = query
        return await this.authKakaoSerive.kakaoLogin(apikey, redirectUri, code)
    }
    //
    // @Post('apple')
    // @ApiOperation({ summary: 'appleLogin' })
    // @ApiResponse({ status: 200, type: SignupResponse, description: 'apple login success!' })
    // appleLogin(
    //     @Body() appleLoginRequest: AppleLoginRequest,
    // ): Promise<SignupResponse> {
    //     return this.appService.signUpApple(appleLoginRequest);
    // }
    //
    // @Post('verification')
    // @ApiOperation({ summary: 'nickname verification' })
    // @ApiResponse({ status: 200, type: VerificationResponse, description: 'kakao login success!' })
    // verificateNickName(
    //     @Body() verificationRequest: VerificationRequest,
    // ): Promise<VerificationResponse> {
    //     return this.appService.verificateNickName(verificationRequest);
    // }
}
