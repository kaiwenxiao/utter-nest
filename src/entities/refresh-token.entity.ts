import type { Opt, Ref } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/postgresql';
import type { User } from './user.entity';
import { BaseEntity } from '@common/database/base.entity';

@Entity()
export class RefreshToken extends BaseEntity {
  @Property()
  expiresIn!: Date;

  @ManyToOne({
    index: true,
  })
  user!: Rel<Ref<User>>;

  @Property()
  isRevoked: boolean & Opt = false;

  constructor(partial?: Partial<RefreshToken>) {
    super();
    Object.assign(this, partial);
  }
}
