import {Injectable} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/database/entity/user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async findByIdAndCheckRT(refresh_token: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        refresh_token
      }
    })
  }

  public async updateRefreshToken(user_id: number, refresh_token: string): Promise<any> {
    await this.userRepo.update(user_id, {refresh_token})
  }

  public generateJWT(platform_id: string, user_id: number): {
    accessToken: string,
    refreshToken: string
  } {
    const accessToken = this.jwtService.sign({ platform_id: String(platform_id), user_id:String(user_id) }, {
      expiresIn: `${this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION')}s`,
    });
    const refreshToken = this.jwtService.sign({ platform_id: String(platform_id), user_id:String(user_id) }, {
      expiresIn: `${this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION')}s`,

    });

    return {
      accessToken,
      refreshToken
    }
  }
}