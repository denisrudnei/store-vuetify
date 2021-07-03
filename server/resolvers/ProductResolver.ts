import { Query, Resolver } from 'type-graphql'
import { Product } from '../models/Product'

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  public GetProducts() {
    return Product.find()
  }
}
