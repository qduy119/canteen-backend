import envConfig from '@/config';
import { createClient, RedisClientType } from 'redis';

export const client: RedisClientType = createClient({
  url: envConfig.REDIS_CONNECTION_URL
});

client.on('connect', () => {
  console.log('Redis connected');
});

client.on('error', (error) => {
  console.error(`Redis client error:`, error);
});

client.on('end', () => {
  console.log('Client disconnected from redis');
});

export const connectToRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log('Unable to connect to Redis:', err);
  }
};
