import { Field, ID, Int, ObjectType } from 'type-graphql'
import { Product } from '../models/Product'

@ObjectType()
class Edge {
  @Field()
  public node!: Product

  @Field()
  public cursor!: number
}

@ObjectType()
class PageInfo {
  @Field(() => ID)
  public endCursor!: number

  @Field()
  public hasNextPage!: boolean
}

@ObjectType()
export class ProductPaginationConnection {
  @Field(() => Int)
  public total!: number

  @Field(() => [Edge])
  public edges!: Edge[]

  @Field(() => PageInfo)
  public pageInfo!: PageInfo
}
