import { validationI18nMessage } from '@lib/i18n/translate';
import { IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';
import { IsUsernameField } from '@common/decorators/validation/is-username.validatior';
import { IsUnique } from '@common/decorators/validation/is-unique.validator';
import { User } from '@modules/user/entities/user.entity';
import { IsStringField } from '@common/decorators/validation/is-string-field.validation';
import { IsEmailField } from '@common/decorators/validation/is-email.validator';
import { IsPasswordField } from '@common/decorators/validation/is-password.validator';
import { IsEnumField } from '@common/decorators/validation/is-enum-field.validation';
import { Roles } from '@common/@types/enums/premission.enum';
import { Type } from 'class-transformer';

export class SocialDto {
  @IsNotEmpty({ message: validationI18nMessage('validation.isNotEmpty') })
  @IsUrl()
  twitter?: string;

  @IsNotEmpty({ message: validationI18nMessage('validation.isNotEmpty') })
  @IsUrl()
  facebook?: string;

  @IsNotEmpty({ message: validationI18nMessage('validation.isNotEmpty') })
  @IsUrl()
  linkedin?: string;
}

export class CreateUserDto {
  @IsUsernameField()
  @IsUnique(() => User, 'username')
  username!: string;

  @IsStringField({ maxLength: 50 })
  firstName!: string;

  @IsStringField({ required: false, maxLength: 50 })
  middleName?: string;

  @IsStringField({ maxLength: 50 })
  lastName!: string

  @IsUnique(() => User, 'email')
  @IsEmailField()
  email!: string;

  @IsStringField({ maxLength: 1000 })
  bio!: string;

  @IsPasswordField({ message: validationI18nMessage('validation.isPassword') })
  password!: string;

  @IsEnumField(Roles, { each: true })
  roles!: Roles[]

  // todo
  @ValidateNested()
  @Type(() => SocialDto)
  social?: SocialDto
}