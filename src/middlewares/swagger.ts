import { Application } from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

export const configure = (app: Application) => {
  const swaggerFilePath = path.join(__dirname, '../docs/swagger.json');
  const swaggerDocs = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
