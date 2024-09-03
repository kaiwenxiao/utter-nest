import {
  Entity,
  ManyToOne,
  Opt,
  Property,
  Ref,
  Rel,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '@common/database/base.entity';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity()
export class Message extends BaseEntity {
  @Property()
  body!: string;

  @ManyToOne({
    index: true,
  })
  // TODO
  sender!: Rel<Ref<User>>;

  @ManyToOne({
    index: true,
  })
  conversation!: Rel<Ref<Conversation>>;

  @Property()
  isRead: boolean & Opt = false;

  @Property()
  readAt?: Date;

  constructor(partial?: Partial<Message>) {
    super();
    Object.assign(this, partial);
  }
}
