import { Router } from 'express'
import multer from 'multer'

import { isLogged } from '../AuthUtil'
import { S3 } from '../S3'
import { CategoryService } from '../services/CategoryService'
import { Category } from '../models/Category'

const CategoryController = Router()

const upload = multer()

CategoryController.post(
  '/category/:id/image',
  upload.single('image'),
  async (req, res) => {
    if (!isLogged(req)) return res.sendStatus(401)
    if (req.session.authUser && req.session.authUser.role !== 'ADMIN')
      return res.sendStatus(401)
    if (!req.file) return res.sendStatus(400)

    const category = await CategoryService.getCategory(
      parseInt(req.params.id, 10)
    )

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `category/${category.id}`,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
      Body: req.file.buffer,
    }

    const { Location } = await S3.upload(params).promise()

    await Category.update(
      {
        id: category.id,
      },
      {
        image: Location,
      }
    )
    return res.status(200).json({ location: Location })
  }
)

export { CategoryController }
