import envConfig from '@/config';
import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

export const logger = winston.createLogger({
  level: envConfig.LOG_LEVEL,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A'
    }),
    printf(({ level, message, context, requestId, timestamp, metadata }) => {
      return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    ...['info', 'error'].map((level) => {
      return new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: `%DATE%-${level}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '1m',
        maxFiles: '7d',
        format: combine(
          timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
          }),
          printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
              return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}}`;
            }
          )
        ),
        level
      });
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});
