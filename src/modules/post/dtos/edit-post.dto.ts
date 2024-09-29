import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from '@modules/post/dtos/create-post.dto';

export class EditPostDto extends PartialType(CreatePostDto) {}