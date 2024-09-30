import { Module } from '@nestjs/common';
import {SharedConfigModule} from "@config/config.share.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";
import {entities} from "@entity/entity";

@Module({
    imports: [
        SharedConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                return {
                    type: 'mysql',
                    host: config.get<string>('DB_HOST'),
                    port: +config.get<string>('DB_PORT'),
                    username: config.get<string>('DB_USER'),
                    password: config.get<string>('DB_PW'),
                    database: config.get<string>('DB_DATABASE'),
                    synchronize: config.get<string>('NODE_ENV') === 'local',
                    entities,
                }
            },
        }),
        TypeOrmModule.forFeature(entities)
    ],
    exports: [
        TypeOrmModule,
        SharedConfigModule
    ]
})
export class DatabaseModule {}