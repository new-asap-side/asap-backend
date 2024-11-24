import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApnConfig } from '@src/apn/apn.config';
import { ApnService } from '@src/apn/apn.service';

@Module({
  imports: [ConfigModule], // ConfigService를 사용하기 위해 ConfigModule import
  providers: [ApnConfig, ApnService],
  exports: [ApnService],
})
export class ApnModule {}
