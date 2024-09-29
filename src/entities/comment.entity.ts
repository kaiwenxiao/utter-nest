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

  // The { index: true } option creates an index in the database for this relationship,
  // which can improve query performance when filtering or joining by the author.

  // Rel<Ref<User>> signifies that author is a reference to a User entity,
  // encapsulated in a relational type. Ref<User> indicates that it refers to a specific User instance, and Rel suggests that this property will have relational capabilities,
  // allowing for easy loading of the related user.

  // TypeScript compiler will think that desired relation entities are always loaded, but not for mikroORM,
  // with `Ref` we can synchronously load these entities but we should change the TypeScript type when use it,
  // likes 'post.service.ts -> addComment':
  // const comment = new Comment({ body: dto.body, author: ref(user) });

  // https://mikro-orm.io/docs/type-safe-relations
  @ManyToOne({ index: true })
  author!: Rel<Ref<User>>;

  constructor(partial?: Partial<Comment>) {
    super();
    Object.assign(this, partial);
  }
}
