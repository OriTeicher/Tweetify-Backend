import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { getTransportOptions } from './getTransportOptions';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      level: 'info',
      transports: [
        getTransportOptions('error', '%DATE%-error.log'),
        getTransportOptions('info', '%DATE%-combined.log'),
      ],
    });
  }

  debug = (message: string) => {
    this.logger.debug(message);
  };

  info = (message: string) => {
    this.logger.info(message);
  };

  error = (message: string) => {
    this.logger.error(message);
  };

  warn = (message: string) => {
    this.logger.warn(message);
  };
}
