import { Router } from 'express'
import cors from 'cors'
import { FakeController } from './controllers/FakeController'

const app = Router()

app.use(cors())

app.use(FakeController)

export { app }
