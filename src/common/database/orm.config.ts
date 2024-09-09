import { Logger, NotFoundException } from '@nestjs/common';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { LoadStrategy } from '@mikro-orm/core';
import { BaseRepository } from '@common/database/base.repository';

const logger = new Logger('MikroORM');

export const baseOptions = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  findOneOrFailHandler: (entityName: string, key: any) => {
    return new NotFoundException(`${entityName} not found for ${key}`);
  },
  migrations: {
    fileName: (timestamp: string, name?: string) => {
      if (!name) return `Migration${timestamp}`;

      return `Migration${timestamp}_${name}`;
    },
    tableName: 'migrations',
    path: './migrations',
    pathTs: undefined,
    glob: '!(*.d).{js,ts}', // .js and .ts files, but not .d.ts
    transactional: true,
    allOrNothing: true,
    snapshot: true,
  },
  seeder: {
    path: './seeders',
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
  },
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  entityResolver: BaseRepository,
  forceUtcTimezone: true,
  registerRequestContext: true,
  pool: { min: 2, max: 10 },
  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },
};
