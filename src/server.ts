import cors from '@elysiajs/cors'
import openapi from '@elysiajs/openapi'
import Elysia from 'elysia'
import * as z from 'zod'

import packageJson from '../package.json' with { type: 'json' }
import { postRoute } from './routes/post.route'
import { statusRoute } from './routes/status.route'
import { runtime } from './runtime'

const server = new Elysia({
  name: 'perlica',
  aot: true,
})
  .use(cors())
  .use(
    openapi({
      mapJsonSchema: { zod: z.toJSONSchema },
      path: '/docs',
      documentation: {
        info: {
          title: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          license: {
            name: packageJson.license,
            url: `${packageJson.repository.url}/blob/main/LICENSE`,
          },
        },
      },
    }),
  )
  .use(statusRoute)

  .use(runtime)
  .use(postRoute)

  .compile()

server.listen(3000, ({ url }) => {
  console.log(`Server is running at ${url}`)
})

export type Server = typeof server
export default server
