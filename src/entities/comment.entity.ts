import { Entity, ManyToOne, Property, Ref, Rel } from '@mikro-orm/postgresql';
import { BaseEntity } from '@common/database/base.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Comment extends BaseEntity {
  @Property()
  body!: string;

  @ManyToOne({ index: true })
  post!: Rel<Ref<Post>>;

  @ManyToOne({ index: true })
  author!: Rel<Ref<User>>;

  constructor(partial?: Partial<Comment>) {
    super();
    Object.assign(this, partial);
  }
}
