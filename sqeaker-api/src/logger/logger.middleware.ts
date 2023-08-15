import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Request, Response, NextFunction } from 'express';
import { ERROR_RANGE, INFO_RANGE, WARN_RANGE } from './constatns';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly loggerMap: Record<number, typeof this.logger.info> = {
    [INFO_RANGE]: this.logger.info,
    [WARN_RANGE]: this.logger.warn,
    [ERROR_RANGE]: this.logger.error,
  };

  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const { method, originalUrl } = req;
      const { statusCode, statusMessage } = res;
      const { remoteAddress } = req.socket;
      const sub: number | null = req[REQUEST_USER_KEY]?.sub ?? null;

      const normalizedResponseStatus = this.normalize(statusCode);
      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} | user id:${sub} ${remoteAddress}`;

      this.loggerMap[INFO_RANGE](message);
      this.loggerMap[normalizedResponseStatus](message);
    });

    next();
  }

  private normalize(status: number): number {
    if (INFO_RANGE <= status && status < WARN_RANGE) return INFO_RANGE;
    else if (WARN_RANGE <= status && status < ERROR_RANGE) return WARN_RANGE;
    return ERROR_RANGE;
  }
}
