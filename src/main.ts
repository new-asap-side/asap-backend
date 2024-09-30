import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {HttpExceptionFilter} from "@filter/filter.http-exception";
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

function setupDocs(app) {
  const options = new DocumentBuilder()
      .setTitle('ASAP API Document')
      .setDescription('This page is an API Document about ASAP')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Content-type', 'Accept']
    }
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
  );

  app.enableCors();
  app.enableShutdownHooks();
  setupDocs(app)

  await app.listen(3000);
}
bootstrap();
