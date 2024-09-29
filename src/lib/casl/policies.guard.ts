import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from '@lib/casl/casl-ability.factory';
import { CHECK_POLICIES_KEY_META, IS_PUBLIC_KEY_META } from '@common/constant/metadata.constants';
import { PolicyHandler } from '@lib/casl/policy.interface';
import { User } from '@entities';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY_META, context.getHandler());

    if (isPublic)
      return true;

    const policyHandlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY_META, context.getHandler()) || [];

    // todo
    const request = context.switchToHttp().getRequest<any>();

    const { user } = request;

    const ability = this.caslAbilityFactory.createForUser(user as User);

    return policyHandlers.every(handler =>
      this.execPolicyHandler,
    );
  }

  private execPolicyHandler(handler: PolicyHandler, request: NestifyRequest, ability: AppAbility) {
    if (typeof handler === 'function')
      return handler(request, ability);

    return handler.handle(request, ability);
  }
}