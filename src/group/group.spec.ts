import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AlarmModule } from '@src/alarm/alarm.module';
import { DatabaseModule } from '@src/database/database.module';
import { GroupService } from '@src/group/group.service';
import { S3Module } from '@src/S3/S3.module';

describe('groupService Test', () => {
  let groupService: GroupService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test', // 테스트 환경변수 파일 경로
          isGlobal: true,
        }),
        AlarmModule,
        DatabaseModule,
        S3Module
      ],
      providers: [GroupService, ConfigService],
    }).compile();

    groupService = app.get<GroupService>(GroupService);
  });

  it('should today rank number', () => {
    groupService.getGroupRankNumber(4, 1)
  });
});
