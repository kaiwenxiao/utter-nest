import { EmailFieldOptions } from '@common/@types';
import { Transform } from 'class-transformer';
import { HelperService } from '@common/helpers/helpers.utils';
import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { validationI18nMessage } from '@lib/i18n/translate';
import { applyDecorators } from '@nestjs/common';

export function IsEmailField(options_?: EmailFieldOptions) {
  const options: EmailFieldOptions = {
    each: false,
    required: true,
    ...options_
  }
  const decoratorsToApply = [
    Transform(({ value } : { value: string }) => value.toLowerCase(), { toClassOnly: true }),
    Transform(
      ({ value }): string =>
        typeof value === 'string' ? HelperService.normalizeEmail(value) : value,
      { toClassOnly: true }
    ),
    IsEmail(
      {},
      {
        message: validationI18nMessage('validation.isDataType', {
          type: 'email address'
        }),
        each: options.each
      }
    )
  ]

  if (options.required) {
    decoratorsToApply.push(
      IsNotEmpty({
        message: validationI18nMessage('validation.isNotEmpty'),
        each: options.each
      })
    )

    if (options.each) {
      decoratorsToApply.push(
        ArrayNotEmpty({
          message: validationI18nMessage('validation.isNotEmpty')
        })
      )
    }
  } else {
    decoratorsToApply.push(IsOptional())
  }

  if (options.each) {
    decoratorsToApply.push(
      IsArray({
        message: validationI18nMessage('validation.isDataType', {
          type: 'array'
        })
      })
    )
  }

  return applyDecorators(...decoratorsToApply)
}