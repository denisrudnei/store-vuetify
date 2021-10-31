import { Arg, Authorized, Query, Resolver } from 'type-graphql'

import { Role } from '../enums/Role'
import { PaymentService } from '../services/PaymentService'
import { PaymentDescription } from '../types/PaymentDescription'
import { Locale } from '../enums/Locale'

@Resolver()
export class PaymentResolver {
  @Query(() => [PaymentDescription])
  @Authorized(Role.USER)
  GetPaymentTypes(
    @Arg('locale', () => Locale, { nullable: true }) locale?: Locale
  ) {
    return PaymentService.getPaymentDescriptions(locale)
  }
}
