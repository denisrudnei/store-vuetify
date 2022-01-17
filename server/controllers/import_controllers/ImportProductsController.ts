import express, { Router } from 'express'
import multer from 'multer'

import { ImportProductService } from '../../services/import_services/ImportProductService'
import { isLogged } from '../../util/auth-util'

const ImportProductsController = Router()

const upload = multer()

ImportProductsController.post(
  '/import/products',
  upload.single('csv'),
  (req: express.Request, res: express.Response) => {
    if (!isLogged(req)) return res.sendStatus(401)

    if (!req.file) return res.sendStatus(400)

    const text = req.file.buffer.toString()

    for (const line of text.split('\n')) {
      const [name, amount, price, category] = line.split(';')

      if (!name) return
      if (!category) return
      ImportProductService.importData(
        name,
        amount,
        price,
        category,
        req.pubSub!
      )
    }
    return res.sendStatus(200)
  }
)

export { ImportProductsController }
