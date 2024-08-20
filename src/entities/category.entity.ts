import {
  BaseEntity,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';

@Entity()
export class Category extends BaseEntity {
  @PrimaryKey({ index: true })
  name!: string;

  @Property()
  description!: string;

  constructor(partial?: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
}
