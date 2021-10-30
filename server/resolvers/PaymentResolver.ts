import { Arg, Authorized, Query, Resolver } from 'type-graphql'

import { Role } from '../enums/Role'
import { PaymentService } from '../services/PaymentService'
import { PaymentDescription } from '../types/PaymentDescription'

@Resolver()
export class PaymentResolver {
  @Query(() => [PaymentDescription])
  @Authorized(Role.USER)
  GetPaymentTypes(
    @Arg('locale', () => String, { nullable: true }) locale?: string
  ) {
    return PaymentService.getPaymentDescriptions(locale)
  }
}
