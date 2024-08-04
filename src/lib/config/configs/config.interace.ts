import { ConfigType } from '@nestjs/config';
import { app } from './app.config';
import { redis } from './redis.config';

export interface Config {
  app: ConfigType<typeof app>;
  redis: ConfigType<typeof redis>;
}
