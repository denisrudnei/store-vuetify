import { Field, ID, InputType } from 'type-graphql'

import { ProductType } from '../enums/ProductType'
import { Category } from '../models/Category'

@InputType()
export class CreateCategoryInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => ID, { nullable: true })
  public father!: Category['id']

  @Field(() => [ProductType], { nullable: true })
  public productsTypes?: ProductType[]
}
