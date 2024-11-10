import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from '@src/profile/profile.controller';
import { ProfileService } from '@src/profile/profile.service';
import { JwtStrategyModule } from '@src/jwt/jwt.module';
import { GroupService } from '@src/group/group.service';
import { GroupController } from '@src/group/group.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtStrategyModule
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: []
})
export class GroupModule {}
