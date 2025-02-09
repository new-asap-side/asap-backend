import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  // payload에 jwt 서명할때 쓰인 객체가 들어있을꺼임
  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization').split('Bearer ')[1];
    console.log(`
    [Refresh token validate]
    [Method]: ${req.method}, 
    [Path]: ${req.route.path}, 
    [Token]: ${refreshToken},
    [Payload]: ${JSON.stringify(payload)}
    `);

    return {
      ...payload,
      refreshToken,
    };
  }
}