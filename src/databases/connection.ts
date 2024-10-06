import envConfig from '@/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  envConfig.DB_DATABASE,
  envConfig.DB_USERNAME,
  envConfig.DB_PASSWORD,
  {
    host: envConfig.DB_HOST,
    port: Number(envConfig.DB_PORT),
    dialect: envConfig.DB_DIALECT,
    logging: false
  }
);

export default sequelize;
