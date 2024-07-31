import { Module } from '@nestjs/common';
import { NestConfigModule } from '../../lib/config/configs/config.module';

@Module({
  imports: [NestConfigModule],
  providers: [],
})
export class SharedModule {}
