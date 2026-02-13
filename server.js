import handler from './build/server/index'
import path from 'path'

const server = Bun.serve({
  fetch: async (req) => {
    const url = new URL(req.url)

    const filePath = path.join('build/client', url.pathname)
    if (await Bun.file(filePath).exists())
      return new Response(Bun.file(filePath))

    return handler.fetch(req)
  },
})

console.log(`Server running at ${server.url}`)
