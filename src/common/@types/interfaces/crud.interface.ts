import { BaseEntity } from '@common/database/base.entity';
import type {
  PaginationResponse,
  PaginationRequest as TPaginationRequest,
} from "./pagination.interface";
import { CreateEntityType, UpdateEntityType } from '@common/@types/types/common.types';
import { Observable } from 'rxjs';
import { User } from '@modules/user/entities/user.entity';

export interface Crud<
  Entity extends BaseEntity,
  PaginationRequest extends TPaginationRequest,
  CreateDto extends CreateEntityType<Entity> = CreateEntityType<Entity>,
  UpdateDto extends UpdateEntityType<Entity> = UpdateEntityType<Entity>
> {
  findAll(query: PaginationRequest): Observable<PaginationResponse<Entity>>

  findOne(index: string): Observable<Entity>

  create(body: CreateDto, user?: User): Observable<Entity>

  update(index: string, body: UpdateDto): Observable<Entity>

  remove(index: string): Observable<Entity>
}