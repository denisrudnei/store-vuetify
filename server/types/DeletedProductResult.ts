import { Field, ObjectType, ID } from 'type-graphql'
import { Product } from '../models/Product'

@ObjectType()
export class DeletedProductResult {
  @Field(() => ID)
  public id!: Product['id']

  @Field()
  public deleted!: boolean
}
