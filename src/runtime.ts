import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ManagedRuntime from 'effect/ManagedRuntime'
import Elysia from 'elysia'

import type { DrizzleError } from '@/lib/errors/drizzle'
import type { HttpError } from '@/lib/errors/http'

import { Drizzle } from '@/lib/drizzle'
import { PostService } from '@/services/post.service'

const appLayer = Layer.mergeAll(PostService.Live)

export const runtime = new Elysia({
  name: 'perlica.runtime',
})
  .onAfterHandle(({ responseValue }) =>
    ManagedRuntime.make(Layer.provide(appLayer, Drizzle.Live)).runPromise(
      (
        responseValue as Effect.Effect<never, DrizzleError | HttpError, never>
      ).pipe(
        Effect.catchTag('DrizzleError', (error) =>
          Effect.succeed(
            Response.json(
              { status: 500, error: error.message },
              { status: 500 },
            ),
          ),
        ),
        Effect.catchTag('HttpError', ({ status, message }) =>
          Effect.succeed(Response.json({ status, message }, { status })),
        ),
      ),
    ),
  )
  .as('global')
