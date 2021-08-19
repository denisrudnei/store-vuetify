import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql'

import { Role } from '../enums/Role'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { Purchase } from '../models/Purchase'
import { PurchaseService } from '../services/PurchaseService'
import { CustomExpressContext } from '../types/CustomExpressContext'
import { Notification } from '../models/notification/Notification'
import { NotificationEvents } from '../enums/NotificationEvents'
import { PurchaseEvents } from '../enums/PurchaseEvents'
import { SummaryEvents } from '../enums/SummaryEvents'

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
  @Authorized(Role.USER)
  public async Buy(
    @Arg('products', () => [ProductForPurchaseInput])
    products: ProductForPurchaseInput[],
    @Arg('nonce', () => String) nonce: string,
    @Arg('deviceData', () => String) deviceData: string,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { req }: CustomExpressContext
  ) {
    const id = req.session.authUser!.id
    const purchase = await PurchaseService.createPurchase(
      id,
      products,
      nonce,
      deviceData
    )
    const notification = Notification.create()
    notification.user = purchase.user
    notification.content = 'New purchase'
    await notification.save()
    pubSub.publish(NotificationEvents.NEW_NOTIFICATION, notification)
    pubSub.publish(PurchaseEvents.NEW_PURCHASE, purchase)
    pubSub.publish(SummaryEvents.UPDATE_SUMMARY, true)
    return purchase
  }

  @FieldResolver()
  public async products(@Root() root: Purchase) {
    const { products } = (await Purchase.findOne(root.id, {
      relations: ['products'],
    })) as Purchase
    return products
  }

  @FieldResolver()
  public async user(@Root() root: Purchase) {
    const { user } = (await Purchase.findOne(root.id, {
      relations: ['user'],
    })) as Purchase
    return user
  }

  @Subscription(() => Purchase, {
    topics: PurchaseEvents.NEW_PURCHASE,
    filter: ({ context }) => {
      if (!context.req || !context.req.authUser) return false
      return context.req.authUser.role === Role.ADMIN
    },
  })
  public NewPurchase(@Root() payload: Purchase) {
    return payload
  }
}
