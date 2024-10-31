import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import * as process from "node:process";
import {AuthModule} from '@src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@src/database/database.module';
import { ProfileController } from '@src/profile/profile.controller';
import { ProfileModule } from '@src/profile/profile.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env': '.env.local',
      isGlobal: true,
    }),
    ProfileModule
  ],
  controllers: [AppController, ProfileController],
  providers: []
})
export class AppModule {}
