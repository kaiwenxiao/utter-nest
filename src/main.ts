import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from './common/typings/globals';
import { HelperService } from './common/helpers/helpers.utils';
import { AppUtils } from './common/helpers/app.utils';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    snapshot: true,
  });

  const configService = app.get(ConfigService<Configs, true>);

  if (!HelperService.isProd()) AppUtils.setupSwagger(app, configService);
}

try {
  (async () => await bootstrap())();
} catch (error) {
  logger.error(error);
}
