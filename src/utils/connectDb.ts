import { define as defineAssociation } from '@/databases/association';
import sequelize from '@/databases/connection';

export const connectToDatabase = async () => {
  try {
    await sequelize.sync();
    defineAssociation();
    console.log('Connection has been established successfully.');
  } catch (err) {
    console.log('Unable to connect to the PostgreSQL database:', err);
  }
};
