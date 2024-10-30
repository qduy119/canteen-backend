import('dotenv/config');
import path from 'path';
import fs from 'fs';
import { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';

export const configure = (app: Application) => {
  const swaggerFilePath = path.join(__dirname, 'swagger.json');
  const swaggerDocs = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
