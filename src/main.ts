import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configs } from './common/typings/globals';
import { HelperService } from './common/helpers/helpers.utils';
import { AppUtils } from './common/helpers/app.utils';
import helmet from 'helmet';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { LoggerErrorInterceptor } from 'nestjs-pino';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compression = require('compression');

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      snapshot: true,
    },
  );

  const configService = app.get(ConfigService<Configs, true>);

  // 1. swagger
  if (!HelperService.isProd()) AppUtils.setupSwagger(app, configService);

  // 2. security and middlewares
  app.enable('trust proxy');
  app.set('etag', 'strong');
  app.use(bodyParser.json({ limit: '10mb' }));

  if (!HelperService.isProd()) {
    app.use(compression());
    app.use(helmet());
    app.enableCors({
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      maxAge: 3600,
      origin: configService.get('app.allowedOrigins', { infer: true }),
    });
  }

  // 3. global pipes, filters and interceptors
  const globalPrefix = configService.get('app.prefix', { infer: true });
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe(AppUtils.validationPipeOptions()));

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
}

try {
  (async () => await bootstrap())();
} catch (error) {
  logger.error(error);
}
