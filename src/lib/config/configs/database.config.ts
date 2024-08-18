import { registerAs } from '@nestjs/config';
import process from 'node:process';

export const database = registerAs('database', () => ({
  clientUrl: process.env.DB_CLIENTURL,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // password: process.env.DB_PASSWORD,
  // user: process.env.DB_USERNAME,
  // dbName: process.env.DB_DATABASE,
}));
