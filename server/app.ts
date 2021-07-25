import './types/CustomExpressContext'

import compression from 'compression'
import cors from 'cors'
import express, { Router } from 'express'
import session from 'express-session'

import { AuthController } from './controllers/AuthController'
import { CategoryController } from './controllers/CategoryController'
import { ProductController } from './controllers/ProductController'
import { SitemapController } from './controllers/SitemapController'
import { SiteSettingsController } from './controllers/SiteSettingsController'
import { UserController } from './controllers/UserController'

const app = Router()

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
app.use(SitemapController)

export { app }
