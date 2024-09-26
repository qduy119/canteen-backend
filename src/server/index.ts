import { createServer, Server } from 'http';
import { expressApp, IExpressApp } from './app';
import * as serverHandlers from './handler';
import { Application } from '../../application';

export function server(opt: IExpressApp): Server {
  const app = expressApp(opt);

  const server = createServer(app);

  function stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      server.close((error: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve('Express Server stopped');
        }
      });
    });
  }

  Application.instance.onStart(() => {
    server.on('error', (error: Error) =>
      serverHandlers.onError(error, opt.port)
    );
    server.on('listening', () => serverHandlers.onListening(server.address()));
    server.listen(opt.port);
  });

  Application.instance.onShutdown(() => stop());

  return server;
}
