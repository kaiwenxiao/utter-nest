import { Module } from '@nestjs/common';
import { NestConfigModule } from '@lib/config/config.module';
import { OrmModule } from '@lib/orm.module';
import { CategoryModule } from '@modules/category/category.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [NestConfigModule, OrmModule, UserModule, CategoryModule],
  providers: [],
})
export class SharedModule {}
