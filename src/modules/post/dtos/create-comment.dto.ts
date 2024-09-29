import { IsStringField } from '@common/decorators/validation/is-string-field.validation';

export class CreateCommentDto {
  @IsStringField()
  body!: string;
}