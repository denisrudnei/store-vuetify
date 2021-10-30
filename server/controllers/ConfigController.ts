import { Router } from 'express'
import { AuthService } from '../services/AuthService'

const ConfigController = Router()

ConfigController.post('/config/info', (req, res) => {
  const { username, password } = req.body

  AuthService.login(username, password)
    .then((user) => {
      const token = AuthService.generateToken(user)
      return res.json({
        graphql: process.env.GRAPHQL,
        subscriptions: process.env.SUBSCRIPTIONS ?? '',
        token,
      })
    })
    .catch((e) => {
      return res.status(401).json({
        message: e.message,
      })
    })
})

export { ConfigController }
