import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';
import { ApiHideProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { HelperService } from '@common/helpers/helpers.utils';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @ApiHideProperty()
  @PrimaryKey({ hidden: true, index: true })
  id!: number;

  @Property({ index: true })
  idx?: string = randomUUID();

  @Property()
  isActive? = true;

  // soft delete
  @Property({ hidden: true })
  isDeleted? = false;

  @Property()
  deletedAt?: Date | null;

  @Property()
  createdAt? = HelperService.getTimeInUtc(new Date());

  @Property({
    onUpdate: () => HelperService.getTimeInUtc(new Date()),
    hidden: true,
  })
  updatedAt? = HelperService.getTimeInUtc(new Date());
}
