import { IsStringField } from '@common/decorators/validation/is-string-field.validation';
import { IsEmailField } from '@common/decorators/validation/is-email.validator';
import { PickType } from '@nestjs/swagger';

export class OtpVerifyDto {
  @IsStringField({
    minLength: 6,
    maxLength: 6
  })
  otpCode!: string;

  @IsEmailField()
  email!: string;
}

export class SendOtpDto extends PickType(OtpVerifyDto, ['email'] as const) {}