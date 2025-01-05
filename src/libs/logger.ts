import { Logger, QueryRunner } from 'typeorm';

export class CustomLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // 쿼리 로깅 생략 (원하지 않을 경우 비워둠)
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.error('Query Failed:', query);
    console.error('Parameters:', parameters);
    console.error('Error:', error);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // 느린 쿼리 로그가 필요하다면 구현
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    // 스키마 빌드 로그 생략
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    // 마이그레이션 로그 생략
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    // 기타 로그 생략
  }
}