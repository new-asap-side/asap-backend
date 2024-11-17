import { createGzip, createGunzip } from 'zlib';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { Injectable, Logger } from '@nestjs/common';
import { toBuffer, toObject } from '@src/libs/S3';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리

const S3_BUCKET = 'asap-resource';
const S3_REGION = 'ap-northeast-2';
const URL_BASE_PATH = process.env.URL_BASE_PATH

@Injectable()
export class S3Service {

  private readonly logger = new Logger(S3Service.name);
  private readonly s3: S3;

  constructor() {
    const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
    const S3_SECRET_KEY = process.env.S3_SECRET_KEY;

    if (!S3_SECRET_KEY || !S3_SECRET_KEY) {
      this.logger.error('S3 credentials are not set in environment variables.');
      throw new Error('S3 credentials are not set in environment variables.');
    }

    this.s3 = new S3({
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY,
        secretAccessKey: S3_SECRET_KEY,
      },
      maxRetries: 3,
      retryDelayOptions: {
        base: 100,
      },
    });
  }

  async upload(base64Data: string) {
  // Base64 데이터에서 파일 타입 추출
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid Base64 format');
  }
  const mimeType = matches[1];
  const base64String = matches[2];
  const uniqueId = uuidv4();
    // MIME 타입에서 확장자 추출
  const extension = mimeType.split('/')[1]; // "png", "jpeg", etc.
  const key = `${uniqueId}.${extension}`; // UUID에 확장자 추가

  // Base64 문자열을 Binary 데이터(Buffer)로 변환
  const buffer = Buffer.from(base64String, 'base64');

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType, // 올바른 MIME 타입 설정
    ACL: 'public-read', // 공개 URL을 통해 접근 가능하도록 설정
  };

  try {
    await this.s3.upload(params).promise();
    return `${URL_BASE_PATH}${key}`;
  } catch (e) {
    this.logger.error(e);
    throw e;
  }
}

  async get(key: string) {
    const params = {
      Bucket: S3_BUCKET,
      Key: key
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return this.decompress(data.Body);
    } catch (e) {
      this.logger.error(`key(${key}): ${e}`);
      // throw (e)
    }
  }


  async delete(key: string): Promise<any> {
    const params = {
      Bucket: S3_BUCKET,
      Key: key
    };

    try {
      return await this.s3.deleteObject(params).promise();
    } catch (e) {
      this.logger.error(`key(${key}): ${e}`);
      // throw (e)
    }
  }

  private compress(data: any): Readable {
    try {
      const buffer = toBuffer(data);
      const input = new Readable();
      input.push(buffer);
      input.push(null);
      return input.pipe(createGzip());
    } catch (e) {
      this.logger.error(e);
      throw (e);
    }
  }

  private async decompress(compressedData: any) {
    try {
      const input = new Readable();
      input.push(compressedData);
      input.push(null);
      const gunzip = createGunzip();
      const buffer = await this.streamToBuffer(input.pipe(gunzip));
      return toObject(buffer);
    } catch (e) {
      this.logger.error(e);
      throw (e);
    }
  }

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async uploadFile(filePathName: string, contentsType : string, data: Buffer) {
    const params = {
      Bucket: S3_BUCKET,
      acl: 'public-read',
      Key: filePathName,
      Body: data,
      ContentType: contentsType
    };

    try {
      await this.s3.upload(params).promise();
      return `http://${URL_BASE_PATH}/${filePathName}`;
    } catch (e) {
      this.logger.error(e);
      throw (e);
    }
  }
}
