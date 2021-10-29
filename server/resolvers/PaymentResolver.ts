import { Authorized, Query, Resolver } from 'type-graphql'

import { PaymentType } from '../enums/PaymentType'
import { Role } from '../enums/Role'

@Resolver()
export class PaymentResolver {
  @Query(() => [String])
  @Authorized(Role.USER)
  GetPaymentTypes() {
    return Object.values(PaymentType)
  }
}
