import { ConfigType } from '@nestjs/config';
import { app } from './app.config';

export interface Config {
  app: ConfigType<typeof app>;
}
