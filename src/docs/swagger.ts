import('dotenv/config');
import envConfig from '@/config';
import swaggerGen from 'swagger-autogen';

const swaggerAutogen = swaggerGen();

const doc = {
  info: {
    title: 'E-Commerce API',
    description: 'Canteen API Information',
    contact: {
      name: 'qduy119'
    },
    version: '1.0.0'
  },
  host: envConfig.SERVER_URL
};

const outputFile = './swagger.json';
const routes = ['../routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
