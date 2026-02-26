import Elysia from 'elysia'

import { env } from '@/lib/env'

import packageJson from '../../package.json' with { type: 'json' }

export const statusRoute = new Elysia()
  .get('/', () => ({
    name: packageJson.name,
    version: packageJson.version,
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
