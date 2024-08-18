import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { PaginationType } from '@common/@types/enums/misc.enum';
import { IsNumberField } from '@common/decorators/validation/is-number-field.validation';
import { PaginationDto } from '@common/dtos/pagination.dto';
import { IsEnumField } from '@common/decorators/validation/is-enum-field.validation';
import { QueryOrder } from '@mikro-orm/postgresql';
import { IsStringField } from '@common/decorators/validation/is-string-field.validation';

export class OffsetPaginationDto extends PaginationDto {
  @ApiProperty()
  @Allow()
  type: PaginationType.OFFSET = PaginationType.OFFSET;

  @IsNumberField({ required: false })
  readonly page = 1;

  @IsNumberField({ required: false, max: 50 })
  readonly limit = 10;

  @IsEnumField(QueryOrder, { required: false })
  readonly order: QueryOrder = QueryOrder.DESC;

  @IsStringField({ required: false, maxLength: 50 })
  readonly sort = 'createAt';

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
