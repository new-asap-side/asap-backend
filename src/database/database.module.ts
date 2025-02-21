import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { entities } from '@src/database/entity/entity';
import { ConfigurationModule } from '@src/config/config.module';
import { CustomLogger } from '@src/libs/logger';

@Module({
    imports: [
      ConfigurationModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                console.log(`NODE_ENV:${ config.get<string>('NODE_ENV')}`)
                console.log(`DB_HOST:${ config.get<string>('DB_HOST')}`)
                console.log(`DB_PORT:${ +config.get<string>('DB_PORT')}`)
                console.log(`DB_USER:${ config.get<string>('DB_USER')}`)
                console.log(`DB_DATABASE:${ config.get<string>('DB_DATABASE')}`)
                console.log(`DB_SYNC:${ !!config.get<boolean>('DB_SYNC') }`)
                return {
                    type: 'mysql',
                    host: config.get<string>('DB_HOST'),
                    port: +config.get<string>('DB_PORT'),
                    username: config.get<string>('DB_USER'),
                    password: config.get<string>('DB_PW'),
                    database: config.get<string>('DB_DATABASE'),
                    synchronize: !!config.get<boolean>('DB_SYNC'),
                    entities,
                    logger: new CustomLogger()
                }
            },
        }),
        TypeOrmModule.forFeature(entities)
    ],
    exports: [
        TypeOrmModule,
    ]
})
export class DatabaseModule {}