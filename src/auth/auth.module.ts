import { Module } from '@nestjs/common';
import {DatabaseModule} from "@database/database.module";
import {AuthController} from "./auth.kakao.controller";
import {AuthKakaoService} from "./auth.kakao.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        DatabaseModule,
        HttpModule
    ],
    controllers: [AuthController],
    providers: [AuthKakaoService],
})
export class AuthModule {}
