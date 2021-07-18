import './types/CustomExpressContext'

import cors from 'cors'
import express, { Router } from 'express'
import session from 'express-session'

import compression from 'compression'
import { AuthController } from './controllers/AuthController'

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

export { app }
