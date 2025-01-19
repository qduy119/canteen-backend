require('dotenv/config');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },
  production: {
    url: process.env.DB_CONNECTION_URI,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
