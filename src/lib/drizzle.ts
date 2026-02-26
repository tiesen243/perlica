import * as orm from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'

import { env } from '@/lib/env'
import { DrizzleError } from '@/lib/errors/drizzle'

const client = drizzle(env.DATABASE_URL ?? '', { casing: 'snake_case' })

export class Drizzle extends Context.Tag('drizzle')<
  Drizzle,
  {
    readonly client: ReturnType<typeof drizzle>
    readonly orm: typeof orm
    readonly query: <T>(
      cb: (client: ReturnType<typeof drizzle>) => Promise<T>,
    ) => Effect.Effect<T, DrizzleError, void>
  }
>() {
  static Live = Layer.succeed(this, {
    client,
    orm,
    query: (cb) =>
      Effect.tryPromise({
        try: () => cb(client),
        catch: (e) =>
          new DrizzleError({
            cause: e instanceof Error ? e.message : String(e),
          }),
      }),
  })
}
