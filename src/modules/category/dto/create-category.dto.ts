import { IsStringField } from "@common/decorators/validation/is-string-field.validation";

export class CreateCategoryDto {
  /**
   * Title of tag
   * @example "Lorem ipsum dolor sit"
   */
  @IsStringField()
    name!: string;

  /**
   * Description of tag
   * @example "Lorem ipsum dolor sit"
   */
  @IsStringField()
    description!: string;
}
