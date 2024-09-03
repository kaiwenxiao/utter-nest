import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';
import { Post } from './post.entity';
import { BaseEntity } from '@common/database/base.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryKey({ index: true })
  name!: string;

  @Property()
  description!: string;

  @ManyToMany(() => Post, (post) => post.categories)
  posts = new Collection<Post>(this);

  constructor(partial?: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
}
