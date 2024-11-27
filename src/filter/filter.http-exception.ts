import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException, HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        console.log("exception-info: ", exception)
        const status = exception instanceof HttpException
          ? exception.getStatus()
          : 500; // 기본값으로 500 설정

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exception?.message ?? 'INTERNAL_SERVER_ERROR'
            });
    }
}
