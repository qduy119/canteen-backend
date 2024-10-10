import('dotenv/config');
import { CustomError } from '@/utils/error';
import { logger } from '@/utils/logger';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

if (!fs.existsSync(path.resolve('.env'))) {
  logger.error('Can not find environment file');
  process.exit(1);
}

export const configSchema = z.object({
  NODE_ENV: z.string().default('development'),
  TZ: z.string().default('Asia/Ho_Chi_Minh'),

  LOG_LEVEL: z.string().default('debug'),

  PORT: z.coerce.number().default(3000),
  CLIENT_URL: z.string(),
  SERVER_URL: z.string(),

  DB_DIALECT: z.enum([
    'mysql',
    'postgres',
    'sqlite',
    'mariadb',
    'mssql',
    'db2',
    'snowflake',
    'oracle'
  ]),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),

  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRATION: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRATION: z.string(),
  TOKEN_COOKIE_EXPIRATION: z.coerce.number().default(365),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),

  VNP_TMNCODE: z.string(),
  VNP_HASHSECRET: z.string(),
  VNP_URL: z.string(),
  VNP_RETURN_URL: z.string(),

  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  GMAIL_USERNAME: z.string(),
  GMAIL_PASSWORD: z.string(),
  GMAIL_FROM: z.string()
});

const configServer = configSchema.safeParse(process.env);

if (!configServer.success) {
  logger.error(configServer.error.issues);
  throw new CustomError(400, configServer.error.message);
}

const envConfig = configServer.data;

export default envConfig;
