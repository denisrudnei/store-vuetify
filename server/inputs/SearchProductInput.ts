import { Field, Float, InputType, ID } from 'type-graphql'

import { Category } from '../models/Category'

@InputType()
export class SearchProductInput {
  @Field({ nullable: true })
  public name?: string

  @Field(() => ID, { nullable: true })
  public category?: Category['id']

  @Field(() => Float, { nullable: true })
  public minPrice?: number

  @Field(() => Float, { nullable: true })
  public maxPrice?: number
}
