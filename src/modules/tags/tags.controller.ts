import { GenericController } from '@common/decorators/controller.decorator';
import { ControllerFactory } from '@lib/crud/crud.controller';
import { Tag } from '../../entities/tag.entity';
import { CursorPaginationDto } from '@common/dtos/cursor-pagination.dto';
import { CreateTagDto, EditTagDto } from '@modules/tags/dto';
import { TagsService } from '@modules/tags/tags.service';

@GenericController('tags')
export class TagsController extends ControllerFactory<Tag, CursorPaginationDto, CreateTagDto, EditTagDto>(CursorPaginationDto, CreateTagDto, EditTagDto) {
  constructor(protected service: TagsService) {
    super();
  }
}