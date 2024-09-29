import { IsStringField } from '@common/decorators/validation/is-string-field.validation';

export class CreateTagDto {
  @IsStringField()
  title!: string;

  @IsStringField()
  description!: string;
}