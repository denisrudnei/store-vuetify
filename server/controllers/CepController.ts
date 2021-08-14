import { Router } from 'express'
import axios from 'axios'

const CepController = Router()

CepController.post('/zipcode', (req, res) => {
  const { zipCode } = req.body
  return axios
    .get(`https://viacep.com.br/ws/${zipCode}/json/`)
    .then((response) => {
      res.json(response.data)
    })
    .catch((e) => {
      res.status(400).json(e.message)
    })
})

export { CepController }
