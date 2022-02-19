import { ObjectType, Field } from 'type-graphql'

import { PaginatedResponse } from '../PaginatedResponse'
import { ProductNode } from './ProductNode'

@ObjectType()
export class ProductPaginationConnection extends PaginatedResponse() {
  @Field(() => [ProductNode])
  public edges!: ProductNode[]
}
