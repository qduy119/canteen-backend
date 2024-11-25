import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';

import { Application } from './application';
import { server } from '@/server';
import envConfig from '@/config';
import { connectToDatabase, connectToRedis, logger } from '@/utils';

(async () => {
  try {
    const PORT = envConfig.PORT || 3000;
    // Init express server
    server({
      port: PORT
    });
    await connectToDatabase();
    await connectToRedis();

    // Start/Stop server
    Application.instance.start();
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
})();
