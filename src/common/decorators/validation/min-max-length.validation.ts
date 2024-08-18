import { MinMaxLengthOptions } from '@common/@types/interfaces/validator.interface';
import { applyDecorators } from '@nestjs/common';
import { MinLength } from 'class-validator';
import { validationI18nMessage } from '@lib/i18n/translate';

export function MinMaxLength(options_?: MinMaxLengthOptions) {
  const options = { minLength: 2, maxLength: 500, each: false, ...options_ };

  return applyDecorators(
    MinLength(options.minLength, {
      message: validationI18nMessage('validation.minLength'),
      each: options.each,
    }),
    MinLength(options.minLength, {
      message: validationI18nMessage('validation.maxLength'),
      each: options.each,
    }),
  );
}
