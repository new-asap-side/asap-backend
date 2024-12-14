import { S3 } from 'aws-sdk';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리

const S3_BUCKET = 'asap-data';
const URL_BASE_PATH = process.env.URL_BASE_PATH

@Injectable()
export class S3Service {

  private readonly logger = new Logger(S3Service.name);

  constructor(
    @Inject('S3_CLIENT')
    private readonly s3: S3
  ) {}

  async upload(base64Data: string) {
  let mimeType: string;
  let base64String: string;

  // MIME 타입이 존재하는지 확인
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    mimeType = matches[1]; // MIME 타입
    base64String = matches[2]; // Base64 인코딩된 데이터
  } else {
    // MIME 타입이 없을 경우, 기본값으로 'image/jpeg' 사용
    console.warn('MIME 타입이 누락되었습니다. 기본 MIME 타입 image/jpeg를 사용합니다.');
    mimeType = 'image/jpeg';
    base64String = base64Data; // 데이터 전체를 Base64로 처리
  }

  const uniqueId = uuidv4();
  // MIME 타입에서 확장자 추출
  const extension = mimeType.split('/')[1] || 'jpg'; // 확장자 설정 (기본값 jpg)
  const key = `${uniqueId}.${extension}`; // UUID에 확장자 추가

  // Base64 문자열을 Binary 데이터(Buffer)로 변환
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64String, 'base64');
  } catch (e) {
    throw new Error('Base64 데이터가 유효하지 않습니다.');
  }

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
    console.error('S3 업로드 실패:', e);
    throw e;
  }
}

  // async get(key: string) {
  //   const params = {
  //     Bucket: S3_BUCKET,
  //     Key: key
  //   };
  //
  //   try {
  //     const data = await this.s3.getObject(params).promise();
  //     return this.decompress(data.Body);
  //   } catch (e) {
  //     this.logger.error(`key(${key}): ${e}`);
  //     // throw (e)
  //   }
  // }
  //
  //
  // async delete(key: string): Promise<any> {
  //   const params = {
  //     Bucket: S3_BUCKET,
  //     Key: key
  //   };
  //
  //   try {
  //     return await this.s3.deleteObject(params).promise();
  //   } catch (e) {
  //     this.logger.error(`key(${key}): ${e}`);
  //     // throw (e)
  //   }
  // }
  //
  // private compress(data: any): Readable {
  //   try {
  //     const buffer = toBuffer(data);
  //     const input = new Readable();
  //     input.push(buffer);
  //     input.push(null);
  //     return input.pipe(createGzip());
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw (e);
  //   }
  // }
  //
  // private async decompress(compressedData: any) {
  //   try {
  //     const input = new Readable();
  //     input.push(compressedData);
  //     input.push(null);
  //     const gunzip = createGunzip();
  //     const buffer = await this.streamToBuffer(input.pipe(gunzip));
  //     return toObject(buffer);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw (e);
  //   }
  // }
  //
  // private streamToBuffer(stream: Readable): Promise<Buffer> {
  //   return new Promise((resolve, reject) => {
  //     const chunks = [];
  //     stream.on('data', chunk => chunks.push(chunk));
  //     stream.on('end', () => resolve(Buffer.concat(chunks)));
  //     stream.on('error', reject);
  //   });
  // }
}
