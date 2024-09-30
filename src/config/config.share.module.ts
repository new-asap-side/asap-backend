import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import "dotenv/config";
import * as process from "process";
import * as _ from "lodash";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: mapToEnvs(),
            isGlobal: true,
        }),
        ConfigModule,
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class SharedConfigModule {}

function mapToEnvs(): string[] {
    const useProductionEnvs = ['production', 'prod'];
    console.log(`NODE_ENV : ${process.env.NODE_ENV}`)

    if(_.includes(useProductionEnvs, process.env.NODE_ENV)) {
        return ['.env']
    } else if (process.env.NODE_ENV == 'dev') {
        return ['.env.dev']
    } else if(process.env.NODE_ENV == 'local') {
        return ['.env.local']
    } else if(process.env.NODE_ENV == 'test') {
        return ['.env.test']
    }
}