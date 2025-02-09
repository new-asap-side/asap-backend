import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { JwtStrategyModule } from '@src/libs/jwt/jwt.module';
import { GroupService } from '@src/group/group.service';
import { GroupController } from '@src/group/group.controller';
import { AlarmModule } from '@src/alarm/alarm.module';
import { S3Module } from '@src/S3/S3.module';
import { AlarmService } from '@src/alarm/alarm.service';

@Module({
  imports: [
    DatabaseModule,
    JwtStrategyModule,
    AlarmModule,
    S3Module
  ],
  controllers: [GroupController],
  providers: [GroupService, AlarmService],
  exports: []
})
export class GroupModule {}
