import { Module } from '@nestjs/common';
import { S3Service } from '@src/S3/S3.service';
import { S3Provider } from '@src/S3/S3.provider';

@Module({
  providers: [S3Service, ...S3Provider],
  exports: [S3Service, ...S3Provider]
})
export class S3Module {}
