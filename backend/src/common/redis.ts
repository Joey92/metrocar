import { REDIS_URL } from './config';
import { createClient } from 'redis';

export const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().catch((e) => {
  throw e;
});

export default redisClient;
