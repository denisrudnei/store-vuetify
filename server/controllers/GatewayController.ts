import { Router } from 'express'
import { GatewayService } from '../services/GatewayService'

const GatewayController = Router()

GatewayController.get('/gateway/token', async (_, res) => {
  return res.json({
    token: await GatewayService.getToken(),
  })
})

export { GatewayController }
