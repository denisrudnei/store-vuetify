import { Router } from 'express'
import multer from 'multer'
import { isLogged } from '../util/auth-util'

import { User } from '../models/User'
import { S3 } from '../S3'

const UserController = Router()

const upload = multer()

UserController.post('/user/image', upload.single('image'), async (req, res) => {
  const logged = await isLogged(req)
  if (!logged) return res.sendStatus(401)
  const id = req.session.authUser!.id
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Body: req.file!.buffer,
    ContentType: req.file!.mimetype,
    ACL: 'public-read',
    Key: `users/${id}/profile/image`,
  }

  const { Location } = await S3.upload(params).promise()
  await User.update(
    {
      id,
    },
    {
      image: Location,
    }
  )
  res.status(200).json({ location: Location })
})

export { UserController }
