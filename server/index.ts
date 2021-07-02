import consola from 'consola'
import express from 'express'

import { app } from './app'

const { loadNuxt, build } = require('nuxt')

const isDev = process.env.NODE_ENV !== 'production'

const server = express()

process.on('SIGTERM', () => process.exit())

async function start() {
  const port = process.env.PORT || 3000

  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  server.use('/api', app)

  server.use(nuxt.render)

  if (isDev) {
    build(nuxt)
  }

  server.listen(port, () => {
    consola.info({
      badge: true,
      message: `Server started on port ${port}`,
    })
  })
}
start()
