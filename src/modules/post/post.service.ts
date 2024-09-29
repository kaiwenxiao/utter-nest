import { Injectable, NotFoundException } from '@nestjs/common';
import { AutoPath, EntityManager, ref } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@common/database/base.repository';
import { Category, Comment, Post, Tag, User } from '@entities';
import { CursorPaginationDto } from '@common/dtos/cursor-pagination.dto';
import { forkJoin, from, map, mergeMap, Observable, of, switchMap, throwError, zip } from 'rxjs';
import { PaginationResponse } from '@common/@types';
import { CursorType, QueryOrder } from '@common/@types/enums/misc.enum';
import { EntityKey } from '@mikro-orm/core';
import { itemDoesNotExistKey, translate } from '@lib/i18n/translate';
import { CreateCommentDto, CreatePostDto, EditPostDto } from '@modules/post/dtos';
import { HelperService } from '@common/helpers/helpers.utils';

@Injectable()
export class PostService {
  private readonly queryName = 'p';

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Post)
    private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: BaseRepository<Comment>,
    @InjectRepository(Tag)
    private readonly tagRepository: BaseRepository<Tag>,
    @InjectRepository(Category)
    private readonly categoryRepository: BaseRepository<Category>,
  ) {
  }

  findAll(dto: CursorPaginationDto): Observable<PaginationResponse<Post>> {
    const qb = this.postRepository.createQueryBuilder(this.queryName);

    return from(
      this.postRepository.qbCursorPagination({
        qb,
        pageOptionsDto: {
          alias: this.queryName,
          cursor: 'title',
          cursorType: CursorType.STRING,
          order: QueryOrder.ASC,
          searchField: 'title',
          ...dto,
        },
      }),
    );
  }

  findOne(slug: string, populate: AutoPath<Post, EntityKey<Post>>[] = []): Observable<Post> {
    return from(
      this.postRepository.findOne(
        {
          slug,
        },
        { populate },
      ),
    ).pipe(
      mergeMap((post) => {
        if (!post) {
          return throwError(
            () =>
              new NotFoundException(
                translate(itemDoesNotExistKey, {
                  args: { item: 'Post' },
                }),
              ),
          );
        }

        return of(post);
      }),
    );
  }

  create(dto: CreatePostDto, author: User): Observable<Post> {
    // many to many
    return zip(
      this.tagRepository.find({
        idx: dto.tags,
      }),
      this.categoryRepository.find({
        idx: dto.categories,
      }),
    ).pipe(
      // if a create not finish yet, and other create comes in, withdraw the previous create action
      switchMap(([tags, categories]) => {
        const post = this.postRepository.create({
          ...HelperService.omit(dto, ['tags', 'categories']),
          author,
          categories,
          tags,
          published: dto.published ?? false,
        });

        // todo -> flush (async?)
        return from(this.em.persistAndFlush(post)).pipe(map(() => post));
      }),
    );
  }

  update(slug: string, dto: EditPostDto): Observable<Post> {
    return this.findOne(slug).pipe(
      switchMap((post) => {
        if (dto.tags) {
          return from(
            this.tagRepository.find({
              idx: dto.tags,
            }),
          ).pipe(
            switchMap((tags) => {
              this.postRepository.assign(post, {
                ...HelperService.omit(dto, ['tags', 'categories']),
              });

              return from(this.em.flush()).pipe(map(() => post));
            }),
          );
        }
        this.postRepository.assign(post, HelperService.omit(dto, ['tags', 'categories']));

        return from(this.em.flush()).pipe(map(() => post));
      }),
    );
  }

  remove(slug: string): Observable<Post> {
    return this.findOne(slug).pipe(
      switchMap((post) => {
        return this.postRepository.softRemoveAndFlush(post).pipe(map(() => post));
      }),
    );
  }

  favorite(userId: number, slug: string): Observable<Post> {
    const post$ = from(this.postRepository.findOneOrFail({ idx: slug }));
    const user$ = from(
      this.userRepository.findOneOrFail(
        { id: userId },
        {
          populate: ['favorites'],
        },
      ),
    );

    // forkJoin like promise.all
    return forkJoin([post$, user$]).pipe(
      switchMap(([post, user]) => {
        if (!user.favorites.contains(post)) {
          user.favorites.add(post);
          post.favoritesCount = (post.favoritesCount ?? 0) + 1;
        }

        return from(this.em.flush()).pipe(map(() => post));
      }),
    );
  }

  unFavorite(userId: number, slug: string): Observable<Post> {
    const post$ = from(
      this.postRepository.findOneOrFail({
        idx: slug,
      }),
    );

    const user$ = from(
      this.userRepository.findOneOrFail(
        { id: userId },
        {
          populate: ['favorites'],
          populateWhere: {
            favorites: { isActive: true, isDeleted: false },
          },
        },
      ),
    );

    return forkJoin([post$, user$]).pipe(
      switchMap(([post, user]) => {
        if (!user.favorites.contains(post)) {
          user.favorites.remove(post);
          post.favoritesCount = (post.favoritesCount ?? 0) - 1;
        }

        return from(this.em.flush()).pipe(map(() => post));
      }),
    );
  }

  findComments(slug: string): Observable<Comment[]> {
    return from(
      this.postRepository.findOne(
        { slug },
        {
          populate: ['comments'],
          populateWhere: {
            comments: { isActive: true, isDeleted: false },
          },
        },
      ),
    ).pipe(switchMap((post) => {
      if (!post) {
        return throwError(
          () =>
            new NotFoundException(
              translate(itemDoesNotExistKey, {
                args: { item: 'post' },
              }),
            ),
        );
      }
      return of(post.comments.getItems());
    }));
  }

  addComment(userId: number, slug: string, dto: CreateCommentDto): Observable<Post> {
    const post$ = this.findOne(slug);
    const user$ = from(this.userRepository.findOneOrFail(userId));

    return forkJoin([post$, user$]).pipe(
      switchMap(([post, user]) => {
        const comment = new Comment({ body: dto.body, author: ref(user) });

        post.comments.add(comment);

        return from(this.em.flush()).pipe(map(() => post));
      }),
    );
  }

  editComment(slug: string, commentIndex: string, commentData: CreateCommentDto) {
    return this.findOne(slug, ["comments"]).pipe(
      switchMap((_post) => {
        return from(this.commentRepository.findOneOrFail({ idx: commentIndex })).pipe(
          switchMap((comment) => {
            this.commentRepository.assign(comment, commentData);

            return from(this.em.flush()).pipe(map(() => _post));
          }),
        );
      }),
    );
  }

  deleteComment(slug: string, commentIndex: string): Observable<Post> {
    return forkJoin([
      this.findOne(slug),
      from(this.commentRepository.findOneOrFail({ idx: commentIndex })),
    ]).pipe(
      switchMap(([post, comment]) => {
        // todo
        // const comment = new Comment({ body: dto.body, author: ref(user) });
        const commentReference = this.commentRepository.getReference(comment.id);

        if (post.comments.contains(commentReference)) {
          post.comments.remove(commentReference);
          from(this.em.removeAndFlush(commentReference)).pipe(map(() => post));
        }

        return of(post);
      }),
    );
  }
}