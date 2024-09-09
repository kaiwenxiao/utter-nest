import {
  ArgumentMetadata,
  Body, Delete,
  Get,
  Injectable,
  Param, Patch,
  Post,
  Query,
  Type,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppUtils } from '@common/helpers/app.utils';
import { BaseEntity } from '@common/database/base.entity';
import { PaginationRequest, PaginationResponse } from '@common/@types';
import { CreateEntityType, UpdateEntityType } from '@common/@types/types/common.types';
import { Crud } from '@common/@types/interfaces/crud.interface';
import { BaseService } from '@lib/crud/crud.service';
import { Observable } from 'rxjs';
import { SwaggerResponse } from '@common/decorators/swagger-api.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated.decorator';
import { LoggedInUser } from '@common/decorators/user.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class AbstractValidatonPipe extends ValidationPipe {
  constructor(private readonly targetTypes: {
    body?: Type<any>,
    query?: Type<any>,
    param?: Type<any>,
    custom?: Type<any>
  }) {
    super(AppUtils.validationPipeOptions());
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const targetType = this.targetTypes[metadata.type] as Type<any>;

    if (!targetType) return super.transform(value, metadata)

    // todo
    return super.transform(value, { ...metadata, metatype: targetType})
  }
}

export function ControllerFactory<
  T extends BaseEntity,
  Q extends PaginationRequest,
  C extends CreateEntityType<T>,
  U extends UpdateEntityType<T>
>(queryDto: Type<Q>, createDto: Type<C>, updateDto: Type<U>): Type<Crud<T, Q, C, U>> {
  // todo
  const createPipe = new AbstractValidatonPipe({
    body: createDto
  })
  const updatePipe = new AbstractValidatonPipe({
    body: updateDto
  })

  const queryPipe = new AbstractValidatonPipe({
    query: queryDto
  })

  class CrudController<
    T extends BaseEntity,
    Q extends PaginationRequest,
    C extends CreateEntityType<T>,
    U extends UpdateEntityType<T>
  > implements Crud<T, Q, C, U> {
    protected service!: BaseService<T, Q, C, U>

    @Get(":idx")
    @SwaggerResponse({
      operation: "Find item",
      badRequest: "Item does not exist.",
      params: ["idx"],
    })
    findOne(@Param("idx") index: string): Observable<T> {
      return this.service.findOne(index);
    }

    @ApiPaginatedResponse(updateDto)
    @UsePipes(queryPipe)
    @Get()
    findAll(@Query() query: Q): Observable<PaginationResponse<T>> {
      return this.service.findAll(query);
    }

    @SwaggerResponse({
      operation: "Create item",
      badRequest: "Item already exists.",
      body: createDto,
      response: updateDto,
    })
    @UsePipes(createPipe)
    @Post()
    create(@Body() body: C, @LoggedInUser() user?: User): Observable<T> {
      return this.service.create(body, user);
    }

    @SwaggerResponse({
      operation: "Item update",
      badRequest: "Item does not exist.",
      params: ["idx"],
      body: updateDto,
      response: updateDto,
    })
    @UsePipes(updatePipe)
    @Patch(":idx")
    update(@Param("idx") index: string, @Body() body: U): Observable<T> {
      return this.service.update(index, body);
    }

    @SwaggerResponse({
      operation: "Item delete",
      badRequest: "Item does not exist.",
      params: ["idx"],
      response: updateDto,
    })
    @Delete(":idx")
    remove(@Param("idx") index: string): Observable<T> {
      return this.service.remove(index);
    }
  }

  return CrudController;
}