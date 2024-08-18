export interface BaseValidator {
  required?: boolean;
  message?: string;
}

interface BaseArrayValidator {
  arrayMaxSize?: number;
  arrayMinSize?: number;
  each?: boolean;
}

export interface DateFieldOptions extends BaseValidator, BaseArrayValidator {
  greaterThan?: boolean;
  lessThan?: boolean;
  date?: Date;
}

export interface StringFieldOptions extends BaseValidator, BaseArrayValidator {
  trim?: boolean;
  regexp?: RegExp;
  minLength?: number;
  maxLength?: number;
  sanitize?: boolean;
}

export interface NumberFieldOptions extends BaseValidator, BaseArrayValidator {
  min?: number;
  max?: number;
  int?: boolean;
  positive?: boolean;
}

export type EnumFieldOptions = BaseValidator & BaseArrayValidator;

export type MinMaxLengthOptions = Pick<
  StringFieldOptions,
  'each' | 'minLength' | 'maxLength'
>;
