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
  Int,
} from 'type-graphql'

import { DeliveryStatus } from '../enums/DeliveryStatus'
import { NotificationEvents } from '../enums/NotificationEvents'
import { ProductEvents } from '../enums/ProductEvents'
import { PurchaseEvents } from '../enums/PurchaseEvents'
import { PurchaseType } from '../enums/PurchaseType'
import { Role } from '../enums/Role'
import { SummaryEvents } from '../enums/SummaryEvents'
import { PaymentInput } from '../inputs/PaymentInput'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { Notification } from '../models/notification/Notification'
import { Purchase } from '../models/Purchase'
import { User } from '../models/User'
import { PurchaseService } from '../services/PurchaseService'
import { CustomExpressContext } from '../types/CustomExpressContext'

@Resolver(() => Purchase)
export class EcommercePurchaseResolver {
  @Query(() => [Purchase])
  @Authorized(Role.OPERATOR)
  public GetPurchases() {
    return PurchaseService.getPurchases()
  }

  @Query(() => [Purchase])
  @Authorized(Role.OPERATOR)
  public GetDelivery() {
    return PurchaseService.getDelivery()
  }

  @Query(() => [Purchase])
  @Authorized(Role.OPERATOR)
  public GetNormalPurchases() {
    return PurchaseService.getNormalPurchases()
  }

  @Query(() => Purchase)
  @Authorized([Role.USER, Role.OPERATOR])
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

  @Query(() => [Purchase])
  @Authorized(Role.OPERATOR)
  public GetMyPurchasesForUser(@Arg('id', () => ID) id: User['id']) {
    return PurchaseService.getPurchasesForUser(id)
  }

  @Mutation(() => Purchase)
  @Authorized(Role.USER)
  public async Buy(
    @Arg('type', () => PurchaseType) type: PurchaseType,
    @Arg('payment', () => PaymentInput) payment: PaymentInput,
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
      type,
      payment,
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
    purchase.products.forEach((product) => {
      pubSub.publish(ProductEvents.PRODUCT_UPDATED, product)
    })
    return purchase
  }

  @Mutation(() => Boolean)
  @Authorized(Role.OPERATOR)
  public async ChangePurchaseStatus(
    @Arg('id', () => ID) id: Purchase['id'],
    @Arg('status', () => DeliveryStatus) status: DeliveryStatus,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await PurchaseService.changeStatus(id, status)
    const notification = Notification.create()
    notification.content = `Your purchase had the status updated to ${status}`
    const purchase = await Purchase.findOne(result.id, { relations: ['user'] })
    notification.user = purchase!.user
    await notification.save()
    pubSub.publish(NotificationEvents.NEW_NOTIFICATION, notification)
    pubSub.publish(PurchaseEvents.DELIVERY_STATUS_UPDATED, result)
    return true
  }

  @Query(() => [Date])
  @Authorized(Role.OPERATOR)
  public DaysWithPurchases(
    @Arg('year', () => Int, { nullable: true }) year: number
  ) {
    return PurchaseService.getDaysWithPurchase(year)
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
      return [Role.ADMIN, Role.OPERATOR].includes(context.req.authUser.role)
    },
  })
  public async NewPurchase(@Root() payload: Purchase) {
    return {
      ...payload,
      payment: await payload.payment(),
    }
  }

  @FieldResolver()
  public async payments(@Root() root: Purchase) {
    const { payments } = (await Purchase.findOne(root.id, {
      relations: ['payments'],
    })) as Purchase
    return payments
  }

  @Subscription(() => Purchase, {
    topics: PurchaseEvents.DELIVERY_STATUS_UPDATED,
    filter: ({ payload, context }) => {
      if (!context.req || !context.req.authUser) return false

      if ([Role.OPERATOR, Role.ADMIN].includes(context.req.authUser.role)) {
        return true
      }

      return payload.user.id === context.req.authUser.id
    },
  })
  public PurchaseStatusUpdated(@Root() payload: Purchase) {
    return payload
  }
}
