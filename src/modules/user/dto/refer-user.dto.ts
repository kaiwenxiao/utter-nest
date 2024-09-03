import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialDto } from '@modules/user/dto/create-user.dto';

export class CreateUserDto {
  @ValidateNested()
  @Type(() => SocialDto)
  social?: SocialDto;
}