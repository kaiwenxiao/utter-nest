import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export const redis = registerAs('redis', () => ({
  url: process.env.REDIS_URI,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: process.env.REDIS_TTL,
}));
