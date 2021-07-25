import { FieldResolver, Resolver, Root } from 'type-graphql'

import { HistoryProduct } from '../models/HistoryProduct'
import { Product } from '../models/Product'

@Resolver(() => HistoryProduct)
export class HistoryProductResolver {
  @FieldResolver()
  public async data(@Root() root: HistoryProduct) {
    const realProduct = await Product.findOne(root.productId)
    if (realProduct) {
      root.data.images = realProduct.images
    }
    return root.data
  }
}
