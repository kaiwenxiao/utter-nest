import { BaseEntity } from '@common/database/base.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/postgresql';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class Conversation extends BaseEntity {
  @Property({ index: true })
  chatName!: string;

  @ManyToMany(() => User, (user) => user.conversations, { index: true })
  users = new Collection<User>(this);

  @OneToMany(() => Message, (message) => message.conversation, {
    // Cascade.REMOVE
    orphanRemoval: true,
  })
  messages = new Collection<Message>(this);

  constructor(partial?: Partial<Conversation>) {
    super();
    Object.assign(this, partial);
  }
}
