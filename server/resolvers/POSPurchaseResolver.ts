import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { POS } from '../models/POS'
import { Purchase } from '../models/Purchase'
import { POSPurchaseService } from '../services/POSPurchaseService'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { PaymentInput } from '../inputs/PaymentInput'
import { User } from '../models/User'

@Resolver(() => Purchase)
export class POSPurchaseResolver {
  @Query(() => [Purchase])
  @Authorized(Role.OPERATOR)
  public GetPurchasesFromPOS(@Arg('id', () => ID) id: POS['id']) {
    return POSPurchaseService.getPurchasesFromPOS(id)
  }

  @Mutation(() => Purchase)
  @Authorized(Role.OPERATOR)
  public PurchaseFromPOS(
    @Arg('user', () => ID, { nullable: true }) user: User['id'],
    @Arg('products', () => [ProductForPurchaseInput])
    products: ProductForPurchaseInput[],
    @Arg('payment', () => [PaymentInput])
    payment: PaymentInput[],
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return POSPurchaseService.createPurchase(id, user, products, payment)
  }
}
