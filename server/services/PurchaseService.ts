import { getConnection, Not, SelectQueryBuilder } from 'typeorm'

import { DeliveryStatus } from '../enums/DeliveryStatus'
import { PaymentType } from '../enums/PaymentType'
import { PurchaseType } from '../enums/PurchaseType'
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
          user.role === 'OPERATOR' ? '1 = 1' : 'purchase."userId" = :user',
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

      purchase.payment = await purchasePayment.save()

      await purchase.save()

      if (!transaction) throw new Error('Error creating transaction')
      if (!transaction.success) throw new Error(transaction.message)
    } else {
      const purchasePayment = Payment.create()
      purchasePayment.change = Math.abs(payment.value - payment.paid)
      purchasePayment.paid = payment.paid
      purchasePayment.type = payment.type
      purchasePayment.value = payment.value

      purchase.payment = await purchasePayment.save()

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
}
