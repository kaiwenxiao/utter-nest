import {
  INestApplication,
  Logger,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ENDPOINT,
  SWAGGER_DESCRIPTION,
  SWAGGER_TITLE,
} from '../constant/string.constants';
import { isArray } from './validator.utils';
import { IS_PUBLIC_KEY_META } from '../constant/metadata.constants';
import { getMiddleware } from 'swagger-stats';
import { swaggerOptions } from '../swagger/swagger.plugin';
import { HelperService } from './helpers.utils';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import process from 'node:process';

const logger = new Logger('App:Utils');

export const AppUtils = {
  // pipe normally with two types, one for validation, one for transform,
  // use two package, so for validation pipe, need install `class-transformer`
  validationPipeOptions(): ValidationPipeOptions {
    return {
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      validateCustomDecorators: true,
      enableDebugMessages: HelperService.isDev(),
      exceptionFactory: i18nValidationErrorFactory,
    };
  },

  async gracefulShutdown(app: INestApplication, code: string) {
    setTimeout(() => process.exit(1), 6000);
    logger.verbose(`Signal received with code ${code} ⚡.`);
    logger.log('❗Closing http server with grace');

    try {
      await app.close();
      logger.log('✅ Http server closed.');
      process.exit(0);
    } catch (error: any) {
      logger.error(`❌ Http server closed with error: ${error}`);
      process.exit(1);
    }
  },

  killAppWithGrace(app: INestApplication) {
    process.on('SIGINT', async () => {
      await AppUtils.gracefulShutdown(app, 'SIGINT');
    });
    process.on('SIGTERM', async () => {
      await AppUtils.gracefulShutdown(app, 'SIGTERM');
    });
  },

  setupSwagger(
    app: INestApplication,
    configService: ConfigService<Configs, true>,
  ) {
    const userName = configService.get('app.swaggerUser');
    const passWord = configService.get('app.swaggerPass');
    const appName = configService.get('app.name');

    const options = new DocumentBuilder()
      .setTitle(SWAGGER_TITLE)
      .addBearerAuth()
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .setDescription(SWAGGER_DESCRIPTION)
      .setVersion(SWAGGER_API_CURRENT_VERSION)
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )
      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'apiKey')
      .build();

    const document = SwaggerModule.createDocument(app, options, {});

    const paths = Object.values(document.paths);

    for (const path of paths) {
      const methods = Object.values(path) as { security: string[] }[];

      for (const method of methods) {
        if (
          isArray(method.security) &&
          method.security.includes(IS_PUBLIC_KEY_META)
        ) {
          method.security = [];
        }
      }
    }

    app.use(
      getMiddleware({
        swaggerSpec: document,
        authentication: true,
        hostname: appName,
        uriPath: '/stats',
        onAuthenticate: (_request: any, username: string, password: string) => {
          return username === userName && password === passWord;
        },
      }),
    );

    SwaggerModule.setup(SWAGGER_API_ENDPOINT, app, document, {
      explorer: true,
      swaggerOptions,
    });
  },
};
