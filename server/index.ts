import 'reflect-metadata'

import http from 'http'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import consola from 'consola'
import express from 'express'
import { buildSchema } from 'type-graphql'
import { execute, subscribe } from 'graphql'

import { SubscriptionServer } from 'subscriptions-transport-ws'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'
import { PubSub } from 'graphql-subscriptions'
import { app, redisClient } from './app'
import CustomAuthChecker from './CustomAuthChecker'
import createConnection from './db/typeormConnection'
import { GatewayService } from './services/GatewayService'
// import { onConnect } from './util/graphql-functions'

const { loadNuxt, build } = require('nuxt')

const isDev = process.env.NODE_ENV !== 'production'

const server = express()

const pubSub = new PubSub()

process.on('SIGTERM', () => process.exit())

async function start() {
  await createConnection
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
  const host = process.env.HOST || '0.0.0.0'

  GatewayService.init()

  const schema = await buildSchema({
    resolvers: [path.resolve(__dirname, 'resolvers/**/*Resolver*')],
    authChecker: CustomAuthChecker,
    pubSub,
  })

  const httpServer = http.createServer(server)

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: 'subscriptions',
    }
  )

  const apolloServer = new ApolloServer({
    introspection: true,
    schema,
    context: ({ req, res }) => {
      // TODO validate context
      /* if (!req || !req.headers) {
        return connection!.context
      } else { */
      return {
        req,
        res,
        pubSub,
      }
      /* } */
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        // eslint-disable-next-line require-await
        async serverWillStart() {
          return {
            async drainServer() {
              await subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  server.use('*', (req: express.Request, _, next) => {
    req.pubSub = pubSub
    next()
  })

  server.use(app)

  await apolloServer.start()

  await redisClient.connect()

  apolloServer.applyMiddleware({ app: server, path: '/graphql', cors: false })

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
