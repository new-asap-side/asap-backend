import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { JwtStrategyModule } from '@src/libs/jwt/jwt.module';
import { AdminController } from '@src/admin/admin.controller';
import { AdminService } from '@src/admin/admin.service';
import { AlarmModule } from '@src/alarm/alarm.module';
import { AlarmService } from '@src/alarm/alarm.service';

@Module({
  imports: [
    AlarmModule,
    DatabaseModule,
    JwtStrategyModule
  ],
  controllers: [AdminController],
  providers: [AdminService, AlarmService],
  exports: []
})
export class AdminModule {}
