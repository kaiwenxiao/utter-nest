import type { Ref } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/postgresql';
import type { User } from './user.entity';
import { BaseEntity } from '@common/database/base.entity';

@Entity()
export class PointRedemptionLog extends BaseEntity {
  @Property()
  points!: number;

  @Property({ columnType: 'numeric(9,2)' })
  amount!: string;

  @ManyToOne()
  user!: Rel<Ref<User>>;

  constructor(partial?: Partial<PointRedemptionLog>) {
    super();
    Object.assign(this, partial);
  }
}
