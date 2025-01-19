import envConfig from '@/config';
import { Sequelize } from 'sequelize';

const env = envConfig.NODE_ENV;
let sequelize: any;

if (env === 'production') {
  sequelize = new Sequelize(envConfig.DB_CONNECTION_URI, {
    logging: false,
    ssl: true
  });
} else {
  sequelize = new Sequelize(
    envConfig.DB_DATABASE,
    envConfig.DB_USERNAME,
    envConfig.DB_PASSWORD,
    {
      host: envConfig.DB_HOST,
      port: envConfig.DB_PORT,
      dialect: envConfig.DB_DIALECT,
      logging: false
    }
  );
}

export default sequelize;
