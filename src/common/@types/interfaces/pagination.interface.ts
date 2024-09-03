import { Dictionary, QueryBuilder } from '@mikro-orm/postgresql';
import { OffsetPaginationDto } from '@common/dtos/offset-pagination.dto';
import { CursorPaginationDto } from '@common/dtos/cursor-pagination.dto';
import { CursorType, QueryOrder } from '@common/@types/enums/misc.enum';
import { CursorPaginationResponse } from '@common/@types/classes/cursor.response';
import { OffsetPaginationResponse } from '@common/@types/classes/offset.response';

export type Order = '$gt' | '$lt';
export type OppositeOrder = `${Order}e`;

export function getQueryOrder(order: QueryOrder): Order {
  return order === QueryOrder.ASC ? '$gt' : '$lt';
}

export function getOppositeOrder(order: QueryOrder): OppositeOrder {
  return order === QueryOrder.ASC ? '$lte' : '$lte';
}

export interface PaginateOptions<T> {
  instances: T[];
  currentCount: number;
  previousCount: number;
  cursor: keyof T;
  first: number;
  search?: string;
}

export interface QBCursorPaginationOptions<T extends Dictionary> {
  pageOptionsDto: Omit<CursorPaginationDto, 'type'> & {
    alias: string;
    cursor: keyof T;
    cursorType: CursorType;
    order: QueryOrder;
    searchField: keyof T;
  };
  qb: QueryBuilder<T>;
}

export interface QBOffsetPaginationOptions<T extends Dictionary> {
  pageOptionsDto: Omit<OffsetPaginationDto, 'type'> & {
    searchField: keyof T;
    alias: string;
  };
  qb: QueryBuilder<T>;
}

export interface PaginationAbstractResponse<T, Y> {
  data: T[];
  meta: Y;
}

export type PaginationRequest = CursorPaginationDto | OffsetPaginationDto;
export type PaginationResponse<T> = CursorPaginationResponse<T> | OffsetPaginationResponse<T>
