import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql'

import { Role } from '../enums/Role'
import { CreatePhoneInput } from '../inputs/CreatePhoneInput'
import { Phone } from '../models/Phone'
import { PhoneService } from '../services/PhoneService'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver()
export class PhoneResolver {
  @Mutation(() => Phone)
  @Authorized(Role.USER)
  public CreatePhone(
    @Arg('phone', () => CreatePhoneInput) phone: CreatePhoneInput,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return PhoneService.create(phone, id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER)
  public RemovePhone(
    @Arg('id', () => ID) phone: Phone['id'],
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return PhoneService.remove(phone, id)
  }
}
