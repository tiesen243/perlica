import * as Effect from 'effect/Effect'
import Elysia from 'elysia'

import { postInsertSchema, postUpdateSchema } from '../models/post.model'
import { PostService } from '../services/post.service'

export const postRoute = new Elysia({
  name: 'perlica.route.post',
  prefix: '/api/posts',
  tags: ['posts'],
})

  .get('/', () =>
    Effect.gen(function* () {
      const postService = yield* PostService
      return yield* postService.all()
    }),
  )

  .get('/:id', ({ params }) =>
    Effect.gen(function* () {
      const postService = yield* PostService
      return yield* postService.one(+params.id)
    }),
  )

  .post(
    '/',
    ({ body }) =>
      Effect.gen(function* () {
        const postService = yield* PostService
        return yield* postService.create(body)
      }),
    { body: postInsertSchema },
  )

  .put(
    '/:id',
    ({ params, body }) =>
      Effect.gen(function* () {
        const postService = yield* PostService
        return yield* postService.update({ ...body, id: +params.id })
      }),
    { body: postUpdateSchema },
  )

  .delete('/:id', ({ params }) =>
    Effect.gen(function* () {
      const postService = yield* PostService
      return yield* postService.delete(+params.id)
    }),
  )
