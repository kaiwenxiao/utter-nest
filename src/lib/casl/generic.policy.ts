import { Action } from '@common/@types/enums/premission.enum';
import { AppAbility } from '@lib/casl/casl-ability.factory';
import { PoliciesHandler } from '@lib/casl/policy.interface';

export class GenericPolicyHandler implements PoliciesHandler {
  constructor(
    private readonly ClassType: any,
    private readonly action: Action = Action.Read,
  ) {
  }

  handle(request: NestifyRequest, ability: AppAbility) {
    if ([Action.Create, Action.Read, Action.Delete].includes(this.action))
      return ability.can(this.action, this.ClassType);

    const id = request.params.id;

    return ability.can(Action.Update, new this.ClassType({ id }));
  }
}