import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import * as process from "node:process";
import {AuthModule} from '@src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env': '.env.local',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
