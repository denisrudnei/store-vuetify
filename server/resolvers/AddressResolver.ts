import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql'

import { Role } from '../enums/Role'
import { CreateAddressInput } from '../inputs/CreateAddressInput'
import { UpdateAddressInput } from '../inputs/UpdateAddressInput'
import { Address } from '../models/Address'
import { AddressService } from '../services/AddressService'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver()
export class AddressResolver {
  @Mutation(() => Address)
  @Authorized(Role.USER)
  public CreateAddress(
    @Arg('address', () => CreateAddressInput) address: CreateAddressInput,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return AddressService.create(address, id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemoveAddress(
    @Arg('id', () => ID) id: Address['id'],
    @Ctx() { req }: CustomExpressContext
  ) {
    const userId = req.session.authUser!.id
    return AddressService.remove(id, userId)
  }

  @Mutation(() => Address)
  @Authorized(Role.USER)
  public UpdateAddress(
    @Arg('address', () => UpdateAddressInput) address: UpdateAddressInput,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return AddressService.update(address, id)
  }
}
