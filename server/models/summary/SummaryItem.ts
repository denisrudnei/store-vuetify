import { Field, Float, ObjectType } from 'type-graphql'

import { ItemType } from './ItemType'

@ObjectType()
export class SummaryItem {
  @Field()
  public name!: string

  @Field(() => Float)
  public value!: number

  @Field(() => ItemType)
  public type!: ItemType
}
