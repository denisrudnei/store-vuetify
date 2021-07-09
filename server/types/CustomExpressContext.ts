import { Session, SessionData } from 'express-session'
import express from 'express'
import { User } from '../models/User'

type Content = {
  authUser?: User
}

declare module 'express' {
  export interface Request {
    session: Session & Content & Partial<SessionData>
  }
}

declare module 'express-session' {
  export interface SessionData {
    authUser?: User
    id: string
  }
}

export interface CustomExpressContext {
  req: express.Request & Request
  res: express.Response
}
