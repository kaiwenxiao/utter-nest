import { StringFieldOptions } from '@common/@types/interfaces/validator.interface';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { validationI18nMessage } from '@lib/i18n/translate';
import { MinMaxLength } from '@common/decorators/validation/min-max-length.validation';
import {
  Sanitize,
  Trim,
} from '@common/decorators/validation/transform.validation';
import { applyDecorators } from '@nestjs/common';

export function IsStringField(options_?: StringFieldOptions) {
  const options = {
    required: true,
    each: false,
    sanitize: true,
    trim: true,
    minLength: 2,
    maxLength: Number.MAX_SAFE_INTEGER,
    arrayMinSize: 0,
    arrayMaxSize: Number.MAX_SAFE_INTEGER,
    ...options_,
  } satisfies StringFieldOptions;
  // satisfies which specific the variant type base on its initial defined rather than type
  // ex: maxLength in StringFieldOptions type should be 'number | undefined' if we use 'const options: StringFieldOptions'
  // but 'satisfies StringFieldOptions', then we refer 'options.maxLength' always be 'number' because 'Number.MAX_SAFE_INTEGER' is 'number'

  const decoratorsToApply = [
    IsString({
      message: validationI18nMessage('validation.isDataType', {
        type: 'string',
      }),
      each: options.each,
    }),
    MinMaxLength({
      minLength: options.minLength,
      maxLength: options.maxLength,
      each: options.each,
    }),
  ];

  if (options.sanitize) {
    decoratorsToApply.push(Sanitize());
  }

  if (options.regexp) {
    decoratorsToApply.push(Matches(options.regexp));
  }

  if (options.trim) {
    decoratorsToApply.push(Trim());
  }

  if (options.required) {
    decoratorsToApply.push(
      IsNotEmpty({
        message: validationI18nMessage('validation.isNotEmpty'),
        each: options.each,
      }),
    );

    if (options.each) {
      decoratorsToApply.push(
        ArrayNotEmpty({
          message: validationI18nMessage('validation.isNotEmpty'),
        }),
      );
    }
  } else {
    decoratorsToApply.push(IsOptional());
  }

  if (options.each) {
    decoratorsToApply.push(
      IsArray({
        message: validationI18nMessage('validation.isDataType', {
          type: 'array',
        }),
      }),

      ArrayMaxSize(options.arrayMaxSize),
      ArrayMinSize(options.arrayMinSize),
    );
  }

  return applyDecorators(...decoratorsToApply);
}
