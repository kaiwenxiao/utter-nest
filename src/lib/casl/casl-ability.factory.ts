import { Injectable } from '@nestjs/common';
import { Tag, User, Post, Comment } from '@entities';
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  Normalize,
  SubjectType,
} from '@casl/ability';
import { Roles } from '@common/@types/enums/permission.enum';
import { Action } from '@common/@types/enums/premission.enum';

export type Subjects = InferSubjects<typeof User | typeof Post | typeof Comment | typeof Tag> | 'all';

// todo
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (user.roles!.includes(Roles.ADMIN))
      can(Action.Manage, 'all');
    else
      can(Action.Read, 'all');

    can(Action.Update, User, { id: user.id });
    cannot(Action.Delete, User);

    can([Action.Delete, Action.Update], Post, { author: user });

    can([Action.Delete, Action.Update], Comment, { author: user });

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}