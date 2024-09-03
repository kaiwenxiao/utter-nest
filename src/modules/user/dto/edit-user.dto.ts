import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

export class EditUserDto extends PartialType(OmitType(CreateUserDto, ['username'] as const)) {}