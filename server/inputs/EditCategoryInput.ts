import { Field, ID, InputType } from 'type-graphql'

import { Category } from '../models/Category'

@InputType()
export class EditCategoryInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => ID, { nullable: true })
  public father?: Category['father']['id']
}
