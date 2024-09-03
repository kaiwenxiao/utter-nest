import {
  IsNotEmpty,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PASSWORD_REGEX } from '@common/constant/regex.constants';
import { applyDecorators } from '@nestjs/common';
import { validationI18nMessage } from '@lib/i18n/translate';
import { MinMaxLength } from '@common/decorators/validation/min-max-length.validation';

@ValidatorConstraint({ async: true })
class IsPasswordConstraint implements ValidatorConstraintInterface {
  async validate(value: string, _arguments: ValidationArguments) {
    return PASSWORD_REGEX.test(value);
  }

  defaultMessage(_arguments: ValidationArguments) {
    const property = _arguments.property;

    return `${property} should contain at least one lowercase letter, one uppercase letter, one numeric digit and one special character`;
  }
}

export function IsPassowrd(validationOptions?: ValidationOptions): PropertyDecorator {
  return function(object: Record<string, any>, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint
    })
  }
}

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint
    })
  }
}

export function IsPasswordField(validationOptions?: ValidationOptions & { minLength?: number, maxLength?: number }) {
  return applyDecorators(
    IsNotEmpty({
      message: validationI18nMessage('validation.isNotEmpty')
    }),
    MinMaxLength({
      minLength: validationOptions?.minLength ?? 8,
      maxLength: validationOptions?.maxLength ?? 8,
    }),
    IsPassword(validationOptions)
  )
}