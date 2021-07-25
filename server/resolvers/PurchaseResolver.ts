import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  ID,
  FieldResolver,
  Root,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { Purchase } from '../models/Purchase'
import { PurchaseService } from '../services/PurchaseService'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver(() => Purchase)
export class PurchaseResolver {
  @Query(() => [Purchase])
  @Authorized(Role.ADMIN)
  public GetPurchases() {
    return PurchaseService.getPurchases()
  }

  @Query(() => Purchase)
  @Authorized(Role.USER)
  public GetPurchase(
    @Arg('id', () => ID) purchase: Purchase['id'],
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return PurchaseService.getPurchase(id, purchase)
  }

  @Query(() => [Purchase])
  @Authorized(Role.USER)
  public GetMyPurchases(@Ctx() { req }: CustomExpressContext) {
    const id = req.session.authUser!.id
    return PurchaseService.getPurchasesForUser(id)
  }

  @Mutation(() => Purchase)
  @Authorized()
  public Buy(
    @Arg('products', () => [ProductForPurchaseInput])
    products: ProductForPurchaseInput[],
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    return PurchaseService.createPurchase(id, products)
  }

  @FieldResolver()
  public async products(@Root() root: Purchase) {
    const { products } = (await Purchase.findOne(root.id, {
      relations: ['products'],
    })) as Purchase
    return products
  }
}
