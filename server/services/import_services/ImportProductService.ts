import { PubSubEngine } from 'type-graphql'

import { Category } from '../../models/Category'
import { Product } from '../../models/Product'
import { ImportEvents } from '../../enums/ImportEvent'

export class ImportProductService {
  public static async importData(
    name: string,
    amount: string,
    price: string,
    category: string,
    pubSub: PubSubEngine
  ) {
    const product = Product.create()
    product.name = name
    const newAmount = isNaN(Number(amount)) ? 0 : Number(amount)
    product.amount = newAmount
    const newPrice = isNaN(Number(price)) ? 0 : Number(price)
    product.price = newPrice

    const categoryInDb = await Category.findOne({
      where: {
        name: category,
      },
    })
    if (!categoryInDb) {
      const newCategory = Category.create()
      newCategory.name = category ?? ''
      await newCategory.save()
      product.category = newCategory
    } else {
      product.category = categoryInDb
    }

    pubSub?.publish(ImportEvents.productImported, `Product ${name} imported`)

    await product.save()
  }
}
