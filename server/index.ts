import 'reflect-metadata'

import http from 'http'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import consola from 'consola'
import express from 'express'
import { buildSchema } from 'type-graphql'

import { app } from './app'
import CustomAuthChecker from './CustomAuthChecker'
import createConnection from './db/typeormConnection'
import { GatewayService } from './services/GatewayService'

const { loadNuxt, build } = require('nuxt')

const isDev = process.env.NODE_ENV !== 'production'

const server = express()

process.on('SIGTERM', () => process.exit())

async function start() {
  await createConnection
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
  const host = process.env.HOST || '0.0.0.0'

  GatewayService.init()

  const apolloServer = new ApolloServer({
    introspection: true,
    schema: await buildSchema({
      resolvers: [path.resolve(__dirname, 'resolvers/**/*Resolver*')],
      authChecker: CustomAuthChecker,
    }),
    context: (context) => ({
      req: context.req,
      res: context.res,
    }),
    playground: {
      endpoint: '/graphql',
    },
    subscriptions: {
      path: '/subscriptions',
    },
  })

  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  server.use(app)

  const httpServer = http.createServer(server)
  apolloServer.applyMiddleware({ app: server, cors: false })
  apolloServer.installSubscriptionHandlers(httpServer)

  server.use(nuxt.render)

  if (isDev) {
    build(nuxt)
  }

  httpServer.listen(port, host)
  consola.info({
    badge: true,
    message: `Server started on port ${port}`,
  })
}
start()
