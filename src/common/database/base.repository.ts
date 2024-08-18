import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  QBFilterQuery,
  FindOptions,
  Loaded,
  Dictionary,
  OrderDefinition,
  QueryOrderMap,
} from '@mikro-orm/postgresql';
import { from, map, Observable, of, switchMap, throwError } from 'rxjs';
import type { BaseEntity } from './base.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { itemDoesNotExistKey, translate } from '@lib/i18n/translate';
import {
  getOppositeOrder,
  getQueryOrder,
  OppositeOrder,
  Order,
  PaginateOptions,
  QBCursorPaginationOptions,
  QBOffsetPaginationOptions,
} from '@common/@types/interfaces/pagination.interface';
import { CursorType, QueryOrder } from '@common/@types/enums/misc.enum';
import {
  OffsetMeta,
  OffsetPaginationResponse,
} from '@common/@types/classes/offset.response';
import { formatSearch } from '@common/helpers/fn.utils';
import { CursorPaginationResponse } from '@common/@types/classes/cursor.response';

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  private readonly encoding: BufferEncoding = 'base64';

  exists(where: QBFilterQuery<T>): Observable<boolean> {
    return from(this.qb().where(where).getCount()).pipe(
      map((count) => count > 0),
    );
  }

  getEntityName(): string {
    return this.entityName.toString();
  }

  softRemove(entity: T): EntityManager {
    entity.deletedAt = new Date();
    entity.isDeleted = true;
    this.em.persist(entity);

    return this.em;
  }

  softRemoveAndFlush(entity: T): Observable<T> {
    entity.deletedAt = new Date();
    entity.isDeleted = true;

    return from(this.em.persistAndFlush(entity)).pipe(map(() => entity));
  }

  findAndPaginate<Populate extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Populate>,
  ): Observable<{ total: number; results: Loaded<T, Populate>[] }> {
    return from(this.findAndCount(where, options)).pipe(
      map(([results, total]) => ({ total, results })),
    );
  }

  delete(entity: T): T {
    this.em.remove(entity);

    return entity;
  }

  findAndDelete(where: FilterQuery<T>): Observable<T> {
    return from(this.findOne(where)).pipe(
      // `switchMap` similar with `map`, `map` wraps each incoming `Observable` through `pipe`,
      // not same with Array.map, just wrap. But `switchMap` featured up like debounce, all the
      // ongoing request Observable will be cancel.
      switchMap((entity) => {
        if (!entity) {
          return throwError(
            () =>
              new NotFoundException(
                translate(itemDoesNotExistKey, {
                  args: { item: this.getEntityName() },
                }),
              ),
          );
        }
        this.em.remove(entity);

        // `of` form many different type of Observables into an Observable, likes array
        return of(entity);
      }),
    );
  }

  findAndSoftDelete(where: FilterQuery<T>): Observable<T> {
    return from(this.findOne(where)).pipe(
      switchMap((entity) => {
        if (!entity) {
          return throwError(
            () =>
              new NotFoundException(
                translate(itemDoesNotExistKey, {
                  args: { item: this.getEntityName() },
                }),
              ),
          );
        }

        return this.softRemoveAndFlush(entity);
      }),
    );
  }

  private getFilters<T>(
    cursor: keyof T,
    decoded: string | number | Date,
    order: Order | OppositeOrder,
  ): FilterQuery<Dictionary<T>> {
    return {
      [cursor]: {
        [order]: decoded,
      },
    };
  }

  decodeCursor(
    cursor: string,
    cursorType: CursorType = CursorType.STRING,
  ): string | number | Date {
    const string = Buffer.from(cursor, this.encoding).toString('utf-8');

    switch (cursorType) {
      case CursorType.DATE: {
        const millisUnix = Number.parseInt(cursor, 10);

        if (Number.isNaN(millisUnix)) {
          throw new BadRequestException(
            translate('exception.cursorInvalidDate'),
          );
        }

        return new Date(millisUnix);
      }
      case CursorType.NUMBER: {
        const number = Number.parseInt(string, 10);

        if (Number.isNaN(number))
          throw new BadRequestException(
            translate('exception.cursorInvalidNumber'),
          );

        return number;
      }
      default: {
        return string;
      }
    }
  }

  encpdeCursor(value: Date | string | number): string {
    let string = value.toString();

    if (value instanceof Date) {
      string = value.getTime().toString();
    }

    return Buffer.from(string, 'utf-8').toString(this.encoding);
  }

  private getOrderBy<T>(
    cursor: keyof T,
    order: QueryOrder,
  ): OrderDefinition<T> {
    return {
      [cursor]: order,
    } as QueryOrderMap<T>;
  }

  /**
   * This is a TypeScript function that performs offset pagination on a query builder and returns an
   * observable of the paginated results.
   */
  qbOffsetPagination<T extends Dictionary>(
    dto: QBOffsetPaginationOptions<T>,
  ): Observable<OffsetPaginationResponse<T>> {
    const { qb, pageOptionsDto } = dto;

    const {
      limit,
      offset,
      order,
      sort,
      fields,
      search,
      from: fromDate,
      to,
      searchField,
    } = pageOptionsDto;
    const selectedFields = [...new Set([...fields, 'id'])];

    if (search) {
      qb.andWhere({
        [searchField]: {
          $ilike: formatSearch(search),
        },
      });
    }

    if (fromDate) {
      qb.andWhere({
        createdAt: {
          $gte: fromDate,
        },
      });
    }

    if (to) {
      qb.andWhere({
        createdAt: {
          $lte: to,
        },
      });
    }

    qb.orderBy({ [sort]: order.toLowerCase() })
      .limit(limit)
      .select(selectedFields)
      .offset(offset);

    const pagination$ = from(qb.getResultAndCount());

    return pagination$.pipe(
      map(([results, itemCount]) => {
        const pageMetaDto = new OffsetMeta({ pageOptionsDto, itemCount });

        return new OffsetPaginationResponse(results, pageMetaDto);
      }),
    );
  }

  async qbCursorPagination<T extends Dictionary>(
    dto: QBCursorPaginationOptions<T>,
  ): Promise<CursorPaginationResponse<T>> {
    const { qb, pageOptionsDto } = dto;

    const {
      after,
      first,
      search,
      relations,
      alias,
      cursor,
      order,
      cursorType,
      fields,
      withDeleted,
      from: fromDate,
      to,
      searchField,
    } = pageOptionsDto;

    qb.where({
      isDeleted: withDeleted,
    });

    if (search && searchField) {
      qb.andWhere({
        [searchField]: {
          $ilike: formatSearch(search),
        },
      });
    }

    if (relations) {
      for (const relation of relations) {
        qb.leftJoinAndSelect(`${alias}.${relation}`, `${alias}_${relation}`);
      }
    }

    if (fromDate) {
      qb.andWhere({
        createdAt: {
          $gte: fromDate,
        },
      });
    }

    if (to) {
      qb.andWhere({
        createdAt: {
          $lte: to,
        },
      });
    }

    let previousCount = 0;
    const stringCursor = String(cursor);
    const aliasCursor = `${alias}.${stringCursor}`;
    const selectedFields = [...new Set([...fields, 'id'])];

    if (after) {
      const decoded = this.decodeCursor(after, cursorType);
      const oppositeOd = getOppositeOrder(order);
      const temporaryQb = qb.clone();

      temporaryQb.andWhere(this.getFilters(cursor, decoded, oppositeOd));
      previousCount = await temporaryQb.count(aliasCursor, true);

      const normalOd = getQueryOrder(order);

      qb.andWhere(this.getFilters(cursor, decoded, normalOd));
    }

    const [entites, count]: [T[], number] = await qb
      .select(selectedFields)
      .orderBy(this.getOrderBy(cursor, order))
      .limit(first)
      .getResultAndCount();

    return this.paginateCursor({
      instances: entites,
      currentCount: count,
      previousCount,
      cursor,
      first,
      search,
    });
  }

  private paginateCursor<T>(
    dto: PaginateOptions<T>,
  ): CursorPaginationResponse<T> {
    const { instances, currentCount, previousCount, cursor, first, search } =
      dto;
    const pages: CursorPaginationResponse<T> = {
      data: instances,
      meta: {
        nextCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
        search: search ?? '',
      },
    };
    const length = instances.length;

    if (length > 0) {
      const last = instances[length - 1]![cursor] as string | number | Date;

      pages.meta.nextCursor = this.encodeCursor(last);
      pages.meta.hasNextPage = currentCount > first;
      pages.meta.hasPreviousPage = previousCount > 0;
    }

    return pages;
  }

  encodeCursor(value: Date | string | number): string {
    let string = value.toString();

    if (value instanceof Date) {
      string = value.getTime().toString();
    }

    return Buffer.from(string, 'utf-8').toString(this.encoding);
  }

  async findAndCountPagination<T extends Dictionary>(
    cursor: keyof T,
    first: number,
    order: QueryOrder,
    repo: EntityRepository<T>,
    where: FilterQuery<T>,
    after?: string,
    afterCursor: CursorType = CursorType.STRING,
  ): Promise<CursorPaginationResponse<T>> {
    let previousCount = 0;

    if (after) {
      const decoded = this.decodeCursor(after, afterCursor);
      const queryOrder = getQueryOrder(order);
      const oppositeOrder = getOppositeOrder(order);
      const countWhere = where;

      // @ts-expect-error "and is a valid key for FilterQuery"
      countWhere['$and'] = this.getFilters('createdAt', decoded, oppositeOrder);
      previousCount = await repo.count(countWhere);

      // @ts-expect-error "and is a valid key for FilterQuery"
      where['$and'] = this.getFilters('createdAt', decoded, queryOrder);
    }

    const [entities, count] = await repo.findAndCount(where, {
      orderBy: this.getOrderBy(cursor, order),
      limit: first,
    });

    return this.paginateCursor({
      instances: entities,
      currentCount: count,
      previousCount,
      cursor,
      first,
    });
  }
}
