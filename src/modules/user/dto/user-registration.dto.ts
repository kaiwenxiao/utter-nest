import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

export class UserRegistrationDto extends OmitType(CreateUserDto, ['roles'] as const) {}