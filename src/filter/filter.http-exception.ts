import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException, HttpStatus, NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // NotFoundException은 로그에 남기지 않음
        if (exception instanceof NotFoundException) {
          response.status(404).json({
            statusCode: 404,
            message: exception.message || 'Not Found',
            timestamp: new Date().toISOString(),
            path: request.url,
          });
          return;
        }

        const status = exception instanceof HttpException
          ? exception.getStatus()
          : 500; // 기본값으로 500 설정

        response
            .status(status)
            .json({
                exception: exception.getResponse(),
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}
