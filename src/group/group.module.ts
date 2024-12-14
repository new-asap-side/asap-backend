import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { JwtStrategyModule } from '@src/jwt/jwt.module';
import { GroupService } from '@src/group/group.service';
import { GroupController } from '@src/group/group.controller';
import { AlarmModule } from '@src/event/event.alarm.module';
import { S3Module } from '@src/S3/S3.module';

@Module({
  imports: [
    DatabaseModule,
    JwtStrategyModule,
    AlarmModule,
    S3Module
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: []
})
export class GroupModule {}
