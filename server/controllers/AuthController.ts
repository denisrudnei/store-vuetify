import express, { Router } from 'express'

import jwt from 'jsonwebtoken'
import { AuthService } from '../services/AuthService'
import { User } from '../models/User'

const AuthController = Router()

AuthController.post('/auth/login', (req, res) => {
  AuthService.login(req.body.username, req.body.password)
    .then((user) => {
      const token = AuthService.generateToken(user)

      req.session!.authUser = user
      res.header('authorization', `Bearer ${token}`)
      return res.status(200).json({
        user: token,
      })
    })
    .catch((e) => {
      return res.status(401).json({ message: e.message })
    })
})

AuthController.post('/auth/register', (req, res) => {
  AuthService.register(req.body)
    .then((user) => {
      return res.status(200).json(user)
    })
    .catch((e) => {
      return res.status(400).json({ message: e.message })
    })
})

AuthController.post(
  '/auth/user',
  async (req: express.Request, res: express.Response) => {
    if (req.session.authUser) {
      return res.status(200).json({
        user: await User.findOne(req.session.authUser.id),
      })
    }
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1]

      const data = jwt.decode(token)
      const user = await User.findOne((data as User).id)
      req.session.authUser = user
      res.header('authorization', `Bearer ${token}`)
      return res.status(200).json({
        user,
      })
    }
    return res.sendStatus(401)
  }
)

AuthController.post('/auth/logout', (req, res) => {
  delete req.session.authUser
  return res.sendStatus(200)
})

export { AuthController }
