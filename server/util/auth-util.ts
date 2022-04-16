import express from 'express'
import { decode } from 'jsonwebtoken'

import { User } from '../models/User'

function getUserByAuthorizationHeader(authorization: string) {
  const items = authorization!.split(' ')
  const token = items[items.length - 1]

  const data = decode(token) as User
  return User.findOneBy({ id: data.id })
}

async function isLogged(req: express.Request) {
  if (!req.headers.authorization && !req.session) return false
  if (req.session.authUser) return true
  if (!req.headers.authorization) return false
  const items = req.headers.authorization!.split(' ')
  const token = items[items.length - 1]

  const data = decode(token)

  req.session.authUser = data as User

  const user = await User.findOneBy({ id: (data as User).id })
  if (!user) return false
  return true
}

export { isLogged, getUserByAuthorizationHeader }
