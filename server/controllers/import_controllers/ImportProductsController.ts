import express, { Router } from 'express'
import multer from 'multer'

import { In } from 'typeorm'
import { ImportProductService } from '../../services/import_services/ImportProductService'
import { isLogged } from '../../util/auth-util'
import { Product } from '../../models/Product'

const ImportProductsController = Router()

const upload = multer()

ImportProductsController.post(
  '/import/products',
  upload.single('csv'),
  async (req: express.Request, res: express.Response) => {
    if (!isLogged(req)) return res.sendStatus(401)

    if (!req.file) return res.sendStatus(400)

    const text = req.file.buffer.toString()
    const lines = text.split('\n')

    const categories = lines
      .map((line) => line.split(';')[3])
      .filter((category) => category != null && category !== '')
    const names = lines.map((line) => line.split(';')[0])
    const existingProducts = await Product.find({
      where: {
        name: In(names),
      },
    })

    await ImportProductService.saveCategories(categories)

    lines.forEach((line) => {
      const [name, amount, price, category] = line.split(';')

      if (!name) return
      if (!category) return
      if (existingProducts.map((product) => product.name).includes(name)) return
      ImportProductService.importData(
        name,
        amount,
        price,
        category,
        req.pubSub!
      )
    })
    return res.sendStatus(200)
  }
)

export { ImportProductsController }
