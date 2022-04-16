import http from 'http'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import consola from 'consola'
import express from 'express'
import { buildSchema } from 'type-graphql'

import { PubSub } from 'graphql-subscriptions'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground'
import { app, redisClient } from './app'
import CustomAuthChecker from './CustomAuthChecker'
import createConnection from './db/typeormConnection'
import { GatewayService } from './services/GatewayService'

const server = express()

const pubSub = new PubSub()

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
      pubSub,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => {
      return {
        req,
        res,
        pubSub,
      }
    },
  })

  server.use('*', (req: express.Request, _, next) => {
    req.pubSub = pubSub
    next()
  })

  server.use(app)

  await apolloServer.start()

  await redisClient.connect()

  const httpServer = http.createServer(server)
  apolloServer.applyMiddleware({ app: server, path: '/graphql', cors: false })

  httpServer.listen(port, host)
  consola.info({
    badge: true,
    message: `Server started on port ${port}`,
  })
}
start()
