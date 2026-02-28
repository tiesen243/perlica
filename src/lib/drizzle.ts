import * as orm from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as ServiceMap from 'effect/ServiceMap'

import { env } from './env'
import { DrizzleError } from './errors/drizzle'

const client = drizzle(env.DATABASE_URL ?? '', { casing: 'snake_case' })

export class Drizzle extends ServiceMap.Service<
  Drizzle,
  {
    readonly client: ReturnType<typeof drizzle>
    readonly orm: typeof orm
    readonly query: <T>(
      cb: (client: ReturnType<typeof drizzle>) => Promise<T>,
    ) => Effect.Effect<T, DrizzleError, void>
  }
>()('perlica.lib.drizzle') {
  static Live = Layer.effect(
    this,
    Effect.succeed({
      client,
      orm,
      query: (cb) =>
        Effect.tryPromise({
          try: () => cb(client),
          catch: () => new DrizzleError(),
        }),
    }),
  )
}
