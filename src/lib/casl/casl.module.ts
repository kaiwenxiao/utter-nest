import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@lib/casl/casl-ability.factory';

@Global()
@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory]
})
export class NestCaslModule {}