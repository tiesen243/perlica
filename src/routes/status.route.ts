import Elysia from 'elysia'

import packageJson from '../../package.json' with { type: 'json' }
import { env } from '../lib/env'

export const statusRoute = new Elysia({
  name: 'perlica.route.status',
  tags: ['status'],
})
  .get('/', () => ({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    homepage: packageJson.homepage,
    repository: packageJson.repository,
    license: packageJson.license,
    openapi: `${packageJson.homepage}/docs`,
  }))
  .get('/health', () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: 'MB',
    },
    cpu: {
      usage: process.cpuUsage(),
    },
  }))
