import { Injectable } from '@nestjs/common';
import { BaseService } from '@lib/crud/crud.service';
import { Tag } from '../../entities/tag.entity';
import { CursorPaginationDto } from '@common/dtos/cursor-pagination.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@common/database/base.repository';

@Injectable()
export class TagsService extends BaseService<Tag, CursorPaginationDto> {
  protected readonly queryName = 't';
  protected readonly searchField = 'title'
  constructor(
    @InjectRepository(Tag) private tagRepository: BaseRepository<Tag>,
  ) {
    super(tagRepository);
  }
}