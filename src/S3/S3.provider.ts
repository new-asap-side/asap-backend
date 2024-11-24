import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3 } from 'aws-sdk';

export const S3Provider = [
    {
        provide: 'S3_CLIENT',
        import: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return new S3({
              region: configService.get('S3_REGION'),
              credentials: {
                accessKeyId: configService.get('S3_ACCESS_KEY'),
                secretAccessKey: configService.get('S3_SECRET_KEY')
              },
              maxRetries: 3,
              retryDelayOptions: {
                base: 100,
              },
            });
        }
    }
]