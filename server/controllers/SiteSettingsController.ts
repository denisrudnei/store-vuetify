import { Router } from 'express'
import multer from 'multer'
import { S3 } from '../S3'
import { SiteSettings } from '../models/SiteSettings'

const SiteSettingsController = Router()

const upload = multer()

SiteSettingsController.post(
  '/site-settings/image',
  upload.single('image'),
  async (req, res) => {
    if (!req.session.authUser || req.session.authUser.role !== 'ADMIN')
      return res.sendStatus(401)

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Body: req.file!.buffer,
      ContentType: req.file!.mimetype,
      ACL: 'public-read',
      Key: 'site-settings/logo',
    }

    const { Location } = await S3.upload(params).promise()
    await SiteSettings.update(
      {},
      {
        logo: Location,
      }
    )
    res.status(200).json({ location: Location })
  }
)

export { SiteSettingsController }
