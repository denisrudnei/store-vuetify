import { Between } from 'typeorm'
import { set } from 'date-fns'
import { POS } from '../models/POS'
import { Purchase } from '../models/Purchase'
import { User } from '../models/User'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { PaymentInput } from '../inputs/PaymentInput'
import { Product } from '../models/Product'
import { HistoryProduct } from '../models/HistoryProduct'
import { Payment } from '../models/Payment'
import { PurchaseType } from '../enums/PurchaseType'
import { PurchaseOrigin } from '../enums/PurchaseOrigin'
import { DeliveryStatus } from '../enums/DeliveryStatus'

export class POSPurchaseService {
  public static getPurchasesFromPOS(id: POS['id']) {
    return Purchase.find({
      where: {
        pos: id,
      },
    })
  }

  public static getPurchaseInDate(date: Date = new Date()) {
    return Purchase.find({
      where: {
        createdAt: Between(
          set(date, {
            seconds: 0,
            minutes: 0,
            hours: 0,
          }),
          set(date, {
            hours: 23,
            minutes: 59,
            seconds: 59,
          })
        ),
        type: PurchaseType.NORMAL,
        origin: PurchaseOrigin.POS,
      },
    })
  }

  public static async createPurchase(
    operatorId: User['id'],
    userId: User['id'],
    posId: POS['id'],
    products: ProductForPurchaseInput[],
    payments: PaymentInput[]
  ) {
    const operator = await User.findOne(operatorId)
    if (!operator) throw new Error('Operator not found')
    const pos = await POS.findOne(posId)
    if (!pos) throw new Error('POS not found')
    const user = await User.findOne({
      where: {
        id: userId,
      },
    })
    const purchase = await Purchase.create().save()
    purchase.operator = operator
    purchase.pos = pos
    purchase.user = user
    purchase.type = PurchaseType.NORMAL
    purchase.origin = PurchaseOrigin.POS
    purchase.status = DeliveryStatus.DELIVERED
    purchase.products = await Promise.all(
      products.map(async (productForPurchase) => {
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
    purchase.payments = []
    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i]
      const newPayment = Payment.create()
      newPayment.change = payment.value - payment.paid
      newPayment.paid = payment.paid
      newPayment.value = payment.paid
      newPayment.type = payment.type
      newPayment.purchase = purchase
      await newPayment.save()
      purchase.payments.push(newPayment)
    }

    return purchase.save()
  }
}
