import { logger } from '@/utils/logger';

export class Application {
  private static _instance: Application;

  private startHandlers: Function[];
  private shutdownHandlers: Function[];

  private constructor() {
    this.startHandlers = [];
    this.shutdownHandlers = [];
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  onStart(handler: Function) {
    this.startHandlers.push(handler);
  }

  onShutdown(handler: Function) {
    this.shutdownHandlers.push(handler);
  }

  start() {
    const onExit = (sig: NodeJS.Signals) => {
      logger.info(`Got ${sig}. Graceful shutdown`);
      this.shutdown();
    };

    // quit on ctrl-c when running docker in terminal
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

    signals.forEach((sig) => process.on(sig, () => onExit(sig)));

    this.startHandlers.forEach((handler) => handler());
    logger.info(`Application started`);
  }

  async shutdown() {
    logger.info(`Shutting down`);
    try {
      const results = await Promise.all(
        this.shutdownHandlers.map((handler) => handler())
      );

      results.forEach((message) => logger.info(message));
      logger.info(`Application stopped!`);
    } catch (error) {
      logger.error('Shutting down failed: ', error);
      process.exitCode = 1;
    } finally {
      process.exit();
    }
  }
}
