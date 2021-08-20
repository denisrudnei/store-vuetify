import { getConnection, SelectQueryBuilder } from 'typeorm'

import { PurchaseType } from '../enums/PurchaseType'
import { PaymentInput } from '../inputs/PaymentInput'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { HistoryProduct } from '../models/HistoryProduct'
import { Product } from '../models/Product'
import { Purchase } from '../models/Purchase'
import { User } from '../models/User'
import { Payment } from '../models/Payment'
import { PaymentType } from '../enums/PaymentType'
import { GatewayService } from './GatewayService'

export class PurchaseService {
  public static getPurchases() {
    return Purchase.find({
      order: {
        createdAt: 'DESC',
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
          user.role === 'ADMIN' ? '1 = 1' : 'purchase."userId" = :user',
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
      purchasePayment.change = payment.value - payment.paid
      purchasePayment.paid = payment.paid
      purchasePayment.type = payment.type
      purchasePayment.value = payment.value

      purchase.payment = await purchasePayment.save()

      await purchase.save()
    }

    return purchase
  }
}
