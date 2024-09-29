import { IsStringField } from '@common/decorators/validation/is-string-field.validation';
import { IsUUIDField } from '@common/decorators/validation/is-uuid.validator';
import { IsEnumField } from '@common/decorators/validation/is-enum-field.validation';
import { PostStateEnum } from '@common/@types/enums/misc.enum';
import { ToBoolean } from '@common/decorators/validation/transform.validation';
import { IsBoolean } from 'class-validator';
import { validationI18nMessage } from '@lib/i18n/translate';

export class CreatePostDto {
  @IsStringField()
  title!: string;

  @IsStringField()
  description!: string;

  @IsStringField()
  content!: string;

  // example:  ["c84ab664-d9a9-4b00-b412-bc31b50c7c50","c84ab664-d9a9-4b00-b412-bc31b50c7c50"]
  @IsUUIDField({ each: true })
  tags!: string[];

  @IsUUIDField({ each: true })
  categories!: string[];

  @IsEnumField(PostStateEnum, { required: false })
  state?: PostStateEnum;

  @ToBoolean()
  @IsBoolean({
    message: validationI18nMessage('validation.isDataType', {
      type: 'boolean'
    })
  })
  published?: boolean;
}