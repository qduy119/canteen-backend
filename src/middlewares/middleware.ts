import {
  Application,
  urlencoded,
  json,
  Request,
  Response,
  NextFunction
} from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { CustomError } from '@/utils/error';

export const configure = (app: Application) => {
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.set('trust proxy', true);
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(json({ limit: '50mb' }));
  // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser());
  // returns the compression middleware
  app.use(compression());
  // providing a Connect/Express middleware that can be used to enable CORS with various options
  app.options('*', cors({ origin: true }));
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Authorization',
        'Accept'
      ]
    })
  );

  // helps you secure your Express apps by setting various HTTP headers
  app.use(helmet());

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
