import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApnConfig } from '@src/apn/apn.config';
import { ApnService } from '@src/apn/apn.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [ApnConfig, ApnService],
  exports: [ApnService],
})
export class ApnModule {}
