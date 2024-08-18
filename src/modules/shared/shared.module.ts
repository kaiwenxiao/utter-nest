import { Module } from '@nestjs/common';
import { NestConfigModule } from '@lib/config/config.module';
import { OrmModule } from '@lib/orm.module';

@Module({
  imports: [NestConfigModule, OrmModule],
  providers: [],
})
export class SharedModule {}
