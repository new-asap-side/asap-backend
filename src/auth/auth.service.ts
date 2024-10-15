import {Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthKakaoResponse } from '../dto/dto.auth';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/entity/user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async findByIdAndCheckRT(user_id: string, refresh_token: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        id: Number(user_id),
        refresh_token
      }
    })
  }

  public async updateHashedRefreshToken(user_id: number, refresh_token: string): Promise<any> {
    await this.userRepo.update(user_id, {refresh_token})
  }

  public generateJWT(platform_id: string, user_id: string): {
    accessToken: string,
    refreshToken: string
  } {
    const accessToken = this.jwtService.sign({ platform_id, user_id }, {
      expiresIn: `${this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION')}s`,
    });
    const refreshToken = this.jwtService.sign({ platform_id, user_id }, {
      expiresIn: `${this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION')}s`,
    });

    return {
      accessToken,
      refreshToken
    }
  }
}