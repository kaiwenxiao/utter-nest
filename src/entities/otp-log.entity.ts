import type { Opt, Ref } from '@mikro-orm/postgresql';
import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/postgresql';
import type { User } from './user.entity';
import { BaseEntity } from '@common/database/base.entity';

@Entity()
export class OtpLog extends BaseEntity {
  @Property()
  expiresIn!: Date;

  @Property({
    length: 20,
    index: true,
  })
  otpCode?: string;

  @ManyToOne({
    index: true,
  })
  user!: Rel<Ref<User>>;

  @Property()
  isUsed: boolean & Opt = false;

  constructor(partial?: Partial<OtpLog>) {
    super();
    Object.assign(this, partial);
  }
}
