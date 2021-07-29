import { getConnection, SelectQueryBuilder } from 'typeorm'
import { Purchase } from '../models/Purchase'
import { User } from '../models/User'
import { Product } from '../models/Product'
import { ProductForPurchaseInput } from '../inputs/ProductForPurchaseInput'
import { HistoryProduct } from '../models/HistoryProduct'

export class PurchaseService {
  public static getPurchases() {
    return Purchase.find()
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
      .getRawMany()

    return result
  }

  public static async createPurchase(
    userId: User['id'],
    productsForPurchase: ProductForPurchaseInput[]
  ) {
    const user = await User.findOne(userId)
    if (!user) throw new Error('User not found')
    const purchase = await Purchase.create().save()
    purchase.user = user

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
    return purchase.save()
  }
}
