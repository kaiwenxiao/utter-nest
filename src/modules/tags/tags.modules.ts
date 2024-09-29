import { Module } from '@nestjs/common';
import { TagsController } from '@modules/tags/tags.controller';
import { TagsService } from '@modules/tags/tags.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tag } from '../../entities/tag.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModules {}