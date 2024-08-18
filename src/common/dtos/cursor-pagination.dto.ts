import { PaginationDto } from '@common/dtos/pagination.dto';
import { ApiHideProperty } from '@nestjs/swagger';
import { Allow, IsBase64 } from 'class-validator';
import { PaginationType } from '@common/@types/enums/misc.enum';
import { IsStringField } from '@common/decorators/validation/is-string-field.validation';
import { validationI18nMessage } from '@lib/i18n/translate';
import { IsNumberField } from '@common/decorators/validation/is-number-field.validation';

export class CursorPaginationDto extends PaginationDto {
  @ApiHideProperty()
  @Allow()
  type: PaginationType.CURSOR = PaginationType.CURSOR;

  @IsStringField({ required: false })
  @IsBase64(
    {},
    {
      message: validationI18nMessage('validation.isDataType', {
        type: 'base64',
      }),
    },
  )
  after?: string;

  @IsNumberField({ required: true })
  first = 10;
}
