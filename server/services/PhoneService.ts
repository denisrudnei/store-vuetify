import { validate } from 'class-validator'
import { SelectQueryBuilder } from 'typeorm'

import { CreatePhoneInput } from '../inputs/CreatePhoneInput'
import { Phone } from '../models/Phone'
import { User } from '../models/User'

export class PhoneService {
  public static async create(phone: CreatePhoneInput, userId: User['id']) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const newPhone = Phone.create()
    newPhone.description = phone.description
    newPhone.number = phone.number
    newPhone.user = user
    const errors = await validate(newPhone)

    if (errors.length) throw new Error('Failed to validate')
    return newPhone.save()
  }

  public static async remove(phoneId: Phone['id'], userId: User['id']) {
    const phone = await Phone.findOne({
      join: {
        alias: 'phone',
        leftJoinAndSelect: {
          user: 'phone.user',
        },
      },
      where: (qb: SelectQueryBuilder<Phone>) => {
        qb.where({
          id: phoneId,
        }).andWhere('phone.user = :userId', { userId })
      },
    })
    if (!phone) throw new Error('Phone not found')
    await Phone.remove(phone)
    return true
  }
}
