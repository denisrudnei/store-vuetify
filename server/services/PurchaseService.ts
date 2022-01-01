import { getDay, getMonth, lastDayOfMonth, set } from 'date-fns'
import { getConnection, Not, SelectQueryBuilder, In } from 'typeorm'

import { DeliveryStatus } from '../enums/DeliveryStatus'
import { PaymentType } from '../enums/PaymentType'
import { PurchaseOrigin } from '../enums/PurchaseOrigin'
import { PurchaseType } from '../enums/PurchaseType'
import { Role } from '../enums/Role'
import { PaymentInput } from '../inputs/PaymentInput'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { HistoryProduct } from '../models/HistoryProduct'
import { Payment } from '../models/Payment'
import { Product } from '../models/Product'
import { Purchase } from '../models/Purchase'
import { User } from '../models/User'
import { GatewayService } from './GatewayService'

export class PurchaseService {
  public static getPurchases() {
    return Purchase.find({
      order: {
        createdAt: 'DESC',
      },
    })
  }

  public static getDelivery() {
    return Purchase.find({
      where: {
        type: PurchaseType.DELIVERY,
        status: Not(DeliveryStatus.DELIVERED),
      },
    })
  }

  public static getNormalPurchases() {
    return Purchase.find({
      where: {
        type: PurchaseType.NORMAL,
        status: Not(DeliveryStatus.DELIVERED),
      },
    })
  }

  public static async getPurchase(userId: User['id'], id: Purchase['id']) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const result = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from(Purchase, 'purchase')
      .where((qb: SelectQueryBuilder<Purchase>) => {
        qb.where({
          id,
        }).andWhere(
          [Role.ADMIN, Role.OPERATOR].includes(user.role)
            ? '1 = 1'
            : 'purchase."userId" = :user',
          {
            user: user.id,
          }
        )
      })
      .getRawOne()

    return result
  }

  public static async getPurchasesForUser(user: User['id']) {
    const result = await getConnection()
      .createQueryBuilder()
      .select('*')
      .from(Purchase, 'purchase')
      .where('purchase."userId" = :user', {
        user,
      })
      .orderBy('purchase.createdAt', 'DESC')
      .getRawMany()

    return result
  }

  public static async getDaysWithPurchase(
    year: number = new Date().getFullYear()
  ) {
    const month = getMonth(new Date()) + 1

    const result = await getConnection()
      .createQueryBuilder()
      .select('EXTRACT(DAY FROM "createdAt") as date')
      .addSelect('EXTRACT(MONTH FROM "createdAt") as month')
      .addSelect('EXTRACT(YEAR FROM "createdAt") as year')
      .from(Purchase, 'purchase')

      .groupBy('year')
      .addGroupBy('month')
      .addGroupBy('date')
      .where('purchase."createdAt" BETWEEN :start and :end', {
        start: set(new Date(), {
          date: 0,
          month: 0,
          year,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }),
        end: set(new Date(), {
          hours: 23,
          minutes: 59,
          seconds: 59,
          month,
          year,
          date: getDay(
            lastDayOfMonth(
              set(new Date(), {
                year,
                month,
              })
            )
          ),
        }),
      })
      .andWhere('type = :type', {
        type: PurchaseType.NORMAL,
      })
      .andWhere('origin = :origin', {
        origin: PurchaseOrigin.POS,
      })
      .getRawMany()

    return result.map((day) =>
      set(new Date(), {
        date: day.date,
        month: day.month - 1,
        year: day.year,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    )
  }

  public static async createPurchase(
    userId: User['id'],
    type: PurchaseType,
    payment: PaymentInput,
    productsForPurchase: ProductForPurchaseInput[],
    nonce: string,
    deviceData: string
  ) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const purchase = await Purchase.create().save()
    purchase.user = user
    purchase.type = type

    purchase.products = await Promise.all(
      productsForPurchase.map(async (productForPurchase) => {
        const product = await Product.findOne(productForPurchase.id)
        if (!product)
          throw new Error(`Product with id ${productForPurchase.id} not found`)
        await Product.update(
          {
            id: product.id,
          },
          {
            amount: (product.amount -= productForPurchase.amount),
          }
        )
        const history = HistoryProduct.create()
        history.productId = productForPurchase.id
        history.data = product
        history.data.amount = productForPurchase.amount
        history.purchase = purchase

        return history.save()
      })
    )
    await purchase.save()

    if (type === PurchaseType.NORMAL) {
      const transaction = await GatewayService.makeSale(
        purchase,
        nonce,
        deviceData
      )
      const totalPrice = await purchase.totalPrice()
      const purchasePayment = Payment.create()
      purchasePayment.change = 0
      purchasePayment.paid = totalPrice
      purchasePayment.type = PaymentType.CARD
      purchasePayment.value = totalPrice
      const singlePayment = await purchasePayment.save()
      purchase.payments = [singlePayment]

      await purchase.save()

      if (!transaction) throw new Error('Error creating transaction')
      if (!transaction.success) throw new Error(transaction.message)
    } else {
      const purchasePayment = Payment.create()
      purchasePayment.change = Math.abs(payment.value - payment.paid)
      purchasePayment.paid = payment.paid
      purchasePayment.type = payment.type
      purchasePayment.value = payment.value
      const singlePayment = await purchasePayment.save()
      purchase.payments = [singlePayment]

      await purchase.save()
    }

    return purchase
  }

  public static async changeStatus(id: Purchase['id'], status: DeliveryStatus) {
    const purchase = await Purchase.findOne(id)
    if (!purchase) throw new Error('Purchase not found')
    await Purchase.update(
      {
        id: purchase.id,
      },
      {
        status,
      }
    )
    return {
      ...purchase,
      status,
    }
  }

  public static async changeStatusForPurchases(
    ids: Purchase['id'][],
    status: DeliveryStatus
  ) {
    await Purchase.update(
      {
        id: In(ids),
      },
      {
        status,
      }
    )
    const purchases = await Purchase.findByIds(ids, { relations: ['user'] })
    return purchases
  }
}
