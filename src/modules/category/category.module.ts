import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from '@entities';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
