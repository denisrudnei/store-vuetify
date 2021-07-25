import { FieldResolver, Resolver, Root } from 'type-graphql'

import { HistoryProduct } from '../models/HistoryProduct'
import { Product } from '../models/Product'

@Resolver(() => HistoryProduct)
export class HistoryProductResolver {
  @FieldResolver()
  public async data(@Root() root: HistoryProduct) {
    const { images } = (await Product.findOne(root.productId)) as Product
    root.data.images = images
    return root.data
  }
}
