import { Application, Request, Response, NextFunction } from 'express';
import { CustomError } from '@/utils/error';

export const configure = (app: Application) => {
  // handler error
  /* eslint-disable @typescript-eslint/no-unused-vars */
  app.use(
    (error: CustomError, req: Request, res: Response, next: NextFunction) => {
      error.statusCode = error.statusCode || 500;
      error.message = error.message || 'Something went wrong';
      return res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message
      });
    }
  );
};
