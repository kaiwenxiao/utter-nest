import { IsEmailField } from '@common/decorators/validation/is-email.validator';
import { IsNotEmpty } from 'class-validator';
import { validationI18nMessage } from '@lib/i18n/translate';

export class UserLoginDto {
  @IsEmailField()
  email!: string;

  @IsNotEmpty({ message: validationI18nMessage('validation.isNotEmpty') })
  password?: string;
}

export class MagicLinkLogin {
  @IsEmailField()
  destination!: string;
}

