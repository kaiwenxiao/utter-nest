import { EntityDTO, FromEntityType, RequiredEntityData } from '@mikro-orm/core';

export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export type RecordWithFile<T, K = File> = T & {
  files: K
}

export type UpdateEntityType<Entity> = Partial<EntityDTO<FromEntityType<Entity>>>
export type CreateEntityType<Entity> = RequiredEntityData<Entity>