import * as express from 'express';
import * as Middleware from '@/middlewares/middleware';
import * as Logger from '@/middlewares/logger';
import * as Swagger from '@/middlewares/swagger';
import * as OAuthPassport from '@/middlewares/passport';
import * as Routes from '@/routes';

export interface IExpressApp {
  port: number | string;
}

export function expressApp(opt: IExpressApp): express.Application {
  const app = express();
  
  Middleware.configure(app);
  Logger.configure(app);
  Swagger.configure(app);
  OAuthPassport.configure(app);

  Routes.init(app);

  app.set('port', opt.port);

  return app;
}
