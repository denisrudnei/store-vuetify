import { Router } from 'express'
import faker from 'faker'

const FakeController = Router()

FakeController.get('/category', (_, res) => {
  res.json(
    Array.from({ length: 5 }, (_, x) => (x += 1)).map((item) => ({
      id: item,
      name: faker.commerce.department(),
    }))
  )
})

FakeController.get('/product', (_, res) => {
  const length = Math.floor(Math.random() * 25)
  res.json(
    Array.from({ length }, (_, x) => (x += 1)).map((item) => ({
      id: item,
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
    }))
  )
})

FakeController.get('/product/:id', (req, res) => {
  res.json({
    id: req.params.id,
    name: faker.commerce.productName(),
    description: faker.lorem.sentences(2),
    price: faker.commerce.price(),
  })
})

export { FakeController }
