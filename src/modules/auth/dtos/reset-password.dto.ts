import { IsStringField } from '@common/decorators/validation/is-string-field.validation';
import { IsPasswordField } from '@common/decorators/validation/is-password.validator';
import { validationI18nMessage } from '@lib/i18n/translate';
import { IsNotEmpty } from 'class-validator';
import { IsEqualToField } from '@common/decorators/validation/is-equal-to.validator';
import { PickType } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsStringField({
    minLength: 6,
    maxLength: 6,
  })
  otpCode!: string;

  @IsPasswordField({ message: validationI18nMessage('validation.isPassword') })
  password!: string;

  @IsNotEmpty({ message: validationI18nMessage('validation.isNotEmpty') })
  @IsEqualToField('password')
  confirmPassword!: string;
}

export class ChangePasswordDto extends PickType(ResetPasswordDto, [
  'password',
  'confirmPassword'
] as const) {
  @IsPasswordField({ message: validationI18nMessage('validation.isPassword') })
  oldPassword!: string;
}