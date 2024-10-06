import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';

import { Application } from './application';
import { server } from '@/server';
import { logger } from '@/utils/logger';
import { connectToDatabase } from '@/utils/connect';
import envConfig from '@/config';

(async () => {
  try {
    const PORT = envConfig.PORT || 3000;
    // Init express server
    server({
      port: PORT
    });
    await connectToDatabase();

    // Start/Stop server
    Application.instance.start();
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
})();
