import { User } from '../../entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedInUser = createParamDecorator((data: keyof User, context: ExecutionContext) => {
  // todo NestifyRequest
  const request = context.switchToHttp().getRequest<any>();

  const user = request.user as User;

  return data ? user[data] : user;
});