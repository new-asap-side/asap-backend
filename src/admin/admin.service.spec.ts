import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AdminService } from '@src/admin/admin.service';
import { DatabaseModule } from '@src/database/database.module';
import { AdminModule } from '@src/admin/admin.module';

describe('admin Service Test', () => {
  let adminService: AdminService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AdminModule,
        DatabaseModule,
        HttpModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
      ],
      providers: [AdminService, ConfigService],
    }).compile();

    adminService = app.get<AdminService>(AdminService);
  });

});
