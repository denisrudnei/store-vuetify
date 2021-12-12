import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql'

import { Role } from '../enums/Role'
import { CreatePhoneInput } from '../inputs/CreatePhoneInput'
import { Phone } from '../models/Phone'
import { PhoneService } from '../services/PhoneService'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { User } from '../models/User'

@Resolver()
export class PhoneResolver {
  @Mutation(() => Phone)
  @Authorized(Role.USER, Role.OPERATOR)
  public CreatePhone(
    @Arg('phone', () => CreatePhoneInput) phone: CreatePhoneInput,
    @Ctx() { req }: CustomExpressContext,
    @Arg('user', () => ID, { nullable: true }) userId?: User['id']
  ) {
    let id = req.session.authUser!.id
    if (
      userId &&
      [Role.ADMIN, Role.OPERATOR].includes(req.session.authUser!.role)
    ) {
      id = userId
    }
    return PhoneService.create(phone, id)
  }

  @Mutation(() => Boolean)
  @Authorized(Role.USER, Role.OPERATOR)
  public RemovePhone(
    @Arg('id', () => ID) phone: Phone['id'],
    @Ctx() { req }: CustomExpressContext,
    @Arg('user', () => ID, { nullable: true }) userId?: User['id']
  ) {
    let id = req.session.authUser!.id
    if (
      userId &&
      [Role.ADMIN, Role.OPERATOR].includes(req.session.authUser!.role)
    ) {
      id = userId
    }

    return PhoneService.remove(phone, id)
  }
}
