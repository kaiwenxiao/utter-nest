import { UUIDFieldOptions } from '@common/@types';
import { validationI18nMessage } from '@lib/i18n/translate';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsUUIDField(options_?: UUIDFieldOptions) {
  const options = {
    each: false,
    required: true,
    ...options_,
  } satisfies UUIDFieldOptions;

  const decoratorsToApply = [
    IsUUID('4', {
      message: validationI18nMessage('validation.isDataType', {
        type: 'uuid',
      }),
      each: options.each,
    }),
  ];

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
    );
  }

  return applyDecorators(...decoratorsToApply);
}

