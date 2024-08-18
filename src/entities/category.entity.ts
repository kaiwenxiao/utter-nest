import { Entity, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '@common/database/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Property({ index: true })
  name!: string;

  @Property()
  description!: string;

  constructor(partial?: Partial<Category>) {
    super();
    Object.assign(this, partial);
  }
}
