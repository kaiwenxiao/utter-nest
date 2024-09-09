import { ApiTags } from '@nestjs/swagger';
import { capitalize } from '@common/helpers/fn.utils';
import { applyDecorators, Controller } from '@nestjs/common';

export function GenericController(name: string, secured = true) {
  const descToApply: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [
    ApiTags(capitalize(name)),
    Controller(name)
  ];

  // todo auth

  return applyDecorators(...descToApply)
}