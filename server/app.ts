import './types/CustomExpressContext'

import compression from 'compression'
import redisConnect from 'connect-redis'
import cors from 'cors'
import express, { Router } from 'express'
import session from 'express-session'
import redis from 'redis'

import { AuthController } from './controllers/AuthController'
import { CategoryController } from './controllers/CategoryController'
import { CepController } from './controllers/CepController'
import { GatewayController } from './controllers/GatewayController'
import { ProductController } from './controllers/ProductController'
import { SitemapController } from './controllers/SitemapController'
import { SiteSettingsController } from './controllers/SiteSettingsController'
import { UserController } from './controllers/UserController'
import { ConfigController } from './controllers/ConfigController'

const app = Router()

const RedisStore = redisConnect(session)
const redisClient = redis.createClient({ url: process.env.REDIS_URL })
const store = new RedisStore({ client: redisClient })

app.use(compression())

app.use(
  cors({
    credentials: true,
    origin: (_, callback) => {
      callback(null, true)
    },
  })
)

app.use(express.json())

app.use(
  session({
    store,
    proxy: true,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    secret: process.env.SECRET!,
    cookie:
      process.env.NODE_ENV === 'production'
        ? {
            sameSite: 'none',
            secure: true,
            maxAge: 60 * 1000 * 30,
          }
        : {
            maxAge: 60 * 1000 * 30,
          },
  })
)

app.use('/api', AuthController)
app.use('/api', SiteSettingsController)
app.use('/api', UserController)
app.use('/api', ProductController)
app.use('/api', CategoryController)
app.use('/api', GatewayController)
app.use('/api', CepController)
app.use('/api', ConfigController)
app.use('/api', SitemapController)

export { app }
