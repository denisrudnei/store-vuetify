import { Router } from 'express'
import multer from 'multer'
import { isLogged } from '../AuthUtil'
import { S3 } from '../S3'
import { Product } from '../models/Product'

const ProductController = Router()

const upload = multer()

ProductController.post(
  '/product/:id/images',
  upload.array('images'),
  async (req, res) => {
    if (!isLogged(req)) return res.sendStatus(401)
    if (req.session.authUser!.role !== 'ADMIN') return res.sendStatus(401)
    if (!req.files) res.sendStatus(400)
    const product = await Product.findOne({
      where: {
        id: req.params.id,
      },
    })
    if (!product)
      return res.sendStatus(400).json({
        message: 'Product not found',
      })
    const files = Object.values(req.files!)
    for (const index in Object.values(req.files!)) {
      const file = files[index]
      const params = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: `product/${req.params.id}/${file.originalname}`,
        ContentType: file.mimetype,
        ACL: 'public-read',
        Body: file.buffer,
      }
      const { Location } = await S3.upload(params).promise()
      product.images = Array.from(new Set([...product.images, Location]))
      await product.save()
    }
  }
)

export { ProductController }
