import { BaseEntity } from '@common/database/base.entity';
import { PaginationRequest, PaginationResponse } from '@common/@types';
import { Crud } from '@common/@types/interfaces/crud.interface';
import { EntityData, EntityKey, FromEntityType } from '@mikro-orm/core';
import { BaseRepository } from '@common/database/base.repository';
import { CreateEntityType, UpdateEntityType } from '@common/@types/types/common.types';
import { from, map, mergeMap, Observable, of, switchMap, throwError } from 'rxjs';
import { CursorType, PaginationType, QueryOrder } from '@common/@types/enums/misc.enum';
import { FilterQuery } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';
import { itemDoesNotExistKey, translate } from '@lib/i18n/translate';

// dto -> service -> controller, but your can abstract a layer before service

export abstract class BaseService<
  Entity extends BaseEntity,
  PRequest extends PaginationRequest,
  CreateDto extends CreateEntityType<Entity> = CreateEntityType<Entity>,
  UpdateDto extends UpdateEntityType<Entity> = UpdateEntityType<Entity>,
> implements Crud<Entity, PRequest> {
  protected searchField!: EntityKey<Entity>;
  protected queryName = 'entity';

  protected constructor(private readonly repository: BaseRepository<Entity>) {
  }

  create(dto: CreateDto): Observable<Entity> {
    const entity = this.repository.create(dto);

    return from(this.repository.getEntityManager().persistAndFlush(entity)).pipe(
      map(() => entity),
    );
  }

  findAll(dto: PaginationRequest): Observable<PaginationResponse<Entity>> {
    const qb = this.repository.createQueryBuilder(this.queryName);

    if (dto.type === PaginationType.CURSOR) {
      return from(
        this.repository.qbCursorPagination({
          qb,
          pageOptionsDto: {
            alias: this.queryName,
            cursor: 'id',
            cursorType: CursorType.NUMBER,
            order: QueryOrder.ASC,
            searchField: this.searchField,
            ...dto
          }
        })
      )
    }

    return this.repository.qbOffsetPagination({
      pageOptionsDto: {
        ...dto,
        alias: this.queryName,
        order: QueryOrder.ASC,
        offset: dto.offset,
        searchField: this.searchField,
      },
      qb,
    })
  }

  findOne(index: string): Observable<Entity> {
    return from(this.repository.findOne({ idx: index } as FilterQuery<Entity>)).pipe(
      mergeMap((entity) => {
        if (!entity) {
          return throwError(
            () =>
              new NotFoundException(
                translate(itemDoesNotExistKey, {
                  args: { item: this.repository.getEntityName() },
                }),
              ),
          );
        }

        return of(entity);
      }),
    );
  }

  update(index: string, dto: UpdateDto): Observable<Entity> {
    return this.findOne(index).pipe(
      switchMap((item) => {
        this.repository.assign(item, dto as EntityData<FromEntityType<Entity>>);

        return from(this.repository.getEntityManager().flush()).pipe(map(() => item));
      }),
    );
  }
}