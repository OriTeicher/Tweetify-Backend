import { createPath } from 'src/common/create-path.helper';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const getTransportOptions = (level: string, fileName: string) => {
  return new winston.transports.DailyRotateFile({
    format: winston.format.json(),
    dirname: 'logs',
    filename: createPath(__dirname, fileName),
    level: level,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });
};
