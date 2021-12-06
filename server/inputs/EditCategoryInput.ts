import { Field, ID, InputType } from 'type-graphql'

import { Category } from '../models/Category'
import { ProductType } from '../enums/ProductType'

@InputType()
export class EditCategoryInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => ID, { nullable: true })
  public father?: Category['id']

  @Field(() => [ProductType], { nullable: true })
  public productsTypes?: ProductType[]

  @Field(() => Boolean, { nullable: true })
  public applyToSubs?: boolean
}
