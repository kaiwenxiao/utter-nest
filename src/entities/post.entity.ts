import {
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
  Collection,
  Entity,
  Enum,
  EventArgs,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Opt,
  Property,
  Ref,
  Rel,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '@common/database/base.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { PostStateEnum } from '@common/@types/enums/misc.enum';
import { HelperService } from '@common/helpers/helpers.utils';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity()
export class Post extends BaseEntity {
  @Property({ index: true })
  slug?: string;

  @Property({ index: true })
  title!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property({ type: 'text' })
  content!: string;

  @Property()
  readingTime: number & Opt = 0;

  @Property()
  readCount: number & Opt = 0;

  @Property({ index: true })
  published: boolean & Opt = false;

  @Property()
  favoritesCount: number & Opt = 0;

  @ManyToOne({
    index: true,
  })
  author!: Rel<Ref<User>>;

  @OneToMany(() => Comment, 'post', {
    orphanRemoval: true,
  })
  comments = new Collection<Comment>(this);

  @ManyToMany(() => Tag, 'posts', { owner: true })
  tags = new Collection<Tag>(this);

  @ManyToMany(() => Category, 'posts', { owner: true })
  categories = new Collection<Category>(this);

  @Enum({ items: () => PostStateEnum })
  state: PostStateEnum & Opt = PostStateEnum.DRAFT;

  constructor(partial?: Partial<Post>) {
    super();
    Object.assign(this, partial);
  }

  @BeforeUpsert()
  @BeforeCreate()
  @BeforeUpdate()
  async generateSlug(arguments_: EventArgs<this>) {
    if (arguments_.changeSet?.payload?.title) {
      this.slug = `${HelperService.slugify(this.title)}-${Math.trunc(Math.random() * 36 ** 6).toString(36)}`;
    }
    this.readingTime = this.getReadingTime(this.content);
  }

  getReadingTime(content: string) {
    const avgWordsPerMin = 250;
    const count = content.match(/\w+/g)?.length ?? 0;

    return Math.ceil(count / avgWordsPerMin);
  }
}
