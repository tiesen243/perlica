import cors from '@elysiajs/cors'
import Elysia from 'elysia'

import { postRoute } from './routes/post.route'
import { statusRoute } from './routes/status.route'
import { runtime } from './runtime'

const server = new Elysia({
  name: 'perlica',
  aot: true,
})
  .use(cors())
  .use(statusRoute)

  .use(runtime)
  .use(postRoute)

  .compile()

server.listen(3000, ({ url }) => {
  console.log(`Server is running at ${url}`)
})

export type Server = typeof server
export default server
