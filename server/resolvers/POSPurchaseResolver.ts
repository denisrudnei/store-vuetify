import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  PubSub,
} from 'type-graphql'

import { PubSubEngine } from 'graphql-subscriptions'
import { Role } from '../enums/Role'
import { POS } from '../models/POS'
import { Purchase } from '../models/Purchase'
import { POSPurchaseService } from '../services/POSPurchaseService'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { PaymentInput } from '../inputs/PaymentInput'
import { User } from '../models/User'
import { PurchaseEvents } from '../enums/PurchaseEvents'
import { SummaryEvents } from '../enums/SummaryEvents'

@Resolver(() => Purchase)
export class POSPurchaseResolver {
  @Query(() => [Purchase])
  @Authorized(Role.OPERATOR)
  public GetPurchasesFromPOS(@Arg('id', () => ID) id: POS['id']) {
    return POSPurchaseService.getPurchasesFromPOS(id)
  }

  @Mutation(() => Purchase)
  @Authorized(Role.OPERATOR)
  public async PurchaseFromPOS(
    @Arg('user', () => ID, { nullable: true }) user: User['id'],
    @Arg('products', () => [ProductForPurchaseInput])
    products: ProductForPurchaseInput[],
    @Arg('payment', () => [PaymentInput])
    payment: PaymentInput[],
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id

    const purchase = await POSPurchaseService.createPurchase(
      id,
      user,
      products,
      payment
    )
    pubSub.publish(PurchaseEvents.NEW_PURCHASE, purchase)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    return purchase
  }
}
