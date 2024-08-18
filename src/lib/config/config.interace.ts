import { ConfigType } from '@nestjs/config';
import { app } from './configs/app.config';
import { redis } from './configs/redis.config';
import { database } from '@lib/config/configs/database.config';

export interface Config {
  app: ConfigType<typeof app>;
  redis: ConfigType<typeof redis>;
  database: ConfigType<typeof database>;
}
