import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ServiceMap from 'effect/ServiceMap'

import type { DrizzleError } from '../lib/errors/drizzle'

import { Drizzle } from '../lib/drizzle'
import { HttpError } from '../lib/errors/http'
import {
  posts,
  type PostInsert,
  type PostSelect,
  type PostUpdate,
} from '../models/post.model'

export class PostService extends ServiceMap.Service<
  PostService,
  {
    all: () => Effect.Effect<PostSelect[], DrizzleError, void>
    one: (
      id: PostSelect['id'],
    ) => Effect.Effect<PostSelect, DrizzleError | HttpError, void>
    create: (
      post: PostInsert,
    ) => Effect.Effect<PostSelect['id'], DrizzleError | HttpError, void>
    update: (
      post: PostUpdate & { id: PostSelect['id'] },
    ) => Effect.Effect<PostSelect['id'], DrizzleError | HttpError, void>
    delete: (
      id: PostSelect['id'],
    ) => Effect.Effect<PostSelect['id'], DrizzleError | HttpError, void>
  }
>()('perlica.service.post') {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const { query, orm } = yield* Drizzle

      return {
        all: () => query((c) => c.select().from(posts)),

        one: (id) =>
          Effect.gen(function* () {
            const [post] = yield* query((c) =>
              c.select().from(posts).where(orm.eq(posts.id, id)).limit(1),
            )
            if (!post)
              return yield* new HttpError({
                status: 404,
                message: 'Post not found',
              })

            return post
          }),

        create: (post) =>
          Effect.gen(function* () {
            const [created] = yield* query((c) =>
              c.insert(posts).values(post).returning({ id: posts.id }),
            )
            if (!created?.id)
              return yield* new HttpError({
                status: 500,
                message: 'Failed to create post',
              })

            return created.id
          }),

        update: (post) =>
          Effect.gen(function* () {
            const [updated] = yield* query((c) =>
              c
                .update(posts)
                .set(post)
                .where(orm.eq(posts.id, post.id))
                .returning({ id: posts.id }),
            )
            if (!updated?.id)
              return yield* new HttpError({
                status: 500,
                message: 'Failed to update post',
              })

            return updated.id
          }),

        delete: (id) =>
          Effect.gen(function* () {
            const [deleted] = yield* query((c) =>
              c
                .delete(posts)
                .where(orm.eq(posts.id, id))
                .returning({ id: posts.id }),
            )
            if (!deleted?.id)
              return yield* new HttpError({
                status: 404,
                message: 'Post not found',
              })

            return deleted.id
          }),
      }
    }),
  )
}

// export class PostService extends ServiceMap.Service<
//   PostService,
//   {
// >()('perlica.service.post') {
//   static Live = Layer.effect(
//     this,
//     Effect.gen(function* () {
//       const { query, orm } = yield* Drizzle
//
//       return PostService.of({
//         all: () => query((c) => c.select().from(posts)),
//
//         one: (id) =>
//           Effect.gen(function* () {
//             const [post] = yield* query((c) =>
//               c.select().from(posts).where(orm.eq(posts.id, id)).limit(1),
//             )
//             if (!post)
//               return yield* new HttpError({
//                 status: 404,
//                 message: 'Post not found',
//               })
//
//             return post
//           }),
//
//       })
//     }),
//   )
// }
