import { IsJWT, IsNotEmpty } from 'class-validator';
import { validationI18nMessage } from '@lib/i18n/translate';

export class RefreshTokenDto {
  @IsNotEmpty({ message: validationI18nMessage('validation.isNotEmpty') })
  @IsJWT({
    message: validationI18nMessage('validation.isDataType', {
      type: 'jwt',
    }),
  })
  refreshToken!: string;
}