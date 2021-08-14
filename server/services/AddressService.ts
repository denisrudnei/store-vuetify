import { validate } from 'class-validator'
import { SelectQueryBuilder } from 'typeorm'

import { CreateAddressInput } from '../inputs/CreateAddressInput'
import { UpdateAddressInput } from '../inputs/UpdateAddressInput'
import { Address } from '../models/Address'
import { User } from '../models/User'

export class AddressService {
  public static async create(address: CreateAddressInput, userId: User['id']) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const newAddress = Address.create()
    Object.assign(newAddress, address)
    newAddress.user = user
    const errors = await validate(newAddress)
    if (errors.length) throw new Error('Failed to validate')
    return newAddress.save()
  }

  public static async update(
    addressToUpdate: UpdateAddressInput,
    userId: User['id']
  ) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')

    const address = await Address.findOne({
      join: {
        alias: 'address',
        leftJoinAndSelect: {
          user: 'address.user',
        },
      },
      where: (qb: SelectQueryBuilder<Address>) => {
        qb.where({
          id: addressToUpdate.id,
        }).andWhere('user.id = :userId', { userId })
      },
    })

    if (!address) throw new Error('Address not found')

    await Address.update(
      {
        id: address.id,
      },
      addressToUpdate
    )

    return addressToUpdate
  }

  public static async remove(addressId: Address['id'], userId: User['id']) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const address = await Address.findOne({
      join: {
        alias: 'address',
        leftJoinAndSelect: {
          user: 'address.user',
        },
      },
      where: (qb: SelectQueryBuilder<Address>) => {
        qb.where({
          id: addressId,
        }).andWhere('user.id = :userId', { userId })
      },
    })

    if (!address) throw new Error('Address not found')
    await Address.remove(address)
    return true
  }
}
