import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { JwtStrategyModule } from '@src/jwt/jwt.module';
import { AdminController } from '@src/admin/admin.controller';
import { AdminService } from '@src/admin/admin.service';

@Module({
  imports: [
    DatabaseModule,
    JwtStrategyModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: []
})
export class AdminModule {}
