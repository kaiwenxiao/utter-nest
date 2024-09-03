import {
  IsNotEmpty,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { USERNAME_REGEX } from '@common/constant/regex.constants';
import { applyDecorators } from '@nestjs/common';
import { validationI18nMessage } from '@lib/i18n/translate';
import { MinMaxLength } from '@common/decorators/validation/min-max-length.validation';

@ValidatorConstraint({ async: true })
class IsUsernameConstraint implements ValidatorConstraintInterface {
  async validate(value: string, _argument: ValidationArguments) {
    return USERNAME_REGEX.test(value);
  }

  defaultMessage(argument: ValidationArguments) {
    const property = argument.property;

    return `${property} must fulfill username's criteria`;
  }
}

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      validator: IsUsernameConstraint
    })
  }
}

export function IsUsernameField(validationOptions?: ValidationOptions & { minLength?: number, maxLength: number }) {
  return applyDecorators(
    IsNotEmpty({
      message: validationI18nMessage('validation.isNotEmpty')
    }),
    MinMaxLength({
      minLength: validationOptions?.minLength ?? 5,
      maxLength: validationOptions?.maxLength ?? 50,
    }),
    IsUsername(validationOptions)
  )
}