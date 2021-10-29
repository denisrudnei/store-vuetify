import { Router } from 'express'

const ConfigController = Router()

ConfigController.get('/config/info.json', (req, res) => {
  res.json({
    graphql: process.env.GRAPHQL,
    subscriptions: process.env.SUBSCRIPTIONS ?? '',
    token: req.headers.authorization ?? '',
  })
})

export { ConfigController }
