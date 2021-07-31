import { Field, Int, ObjectType } from 'type-graphql'
import { ItemType } from './ItemType'

@ObjectType()
export class SummaryItem {
  @Field()
  public name!: string

  @Field(() => Int)
  public value!: number

  @Field(() => ItemType)
  public type!: ItemType
}
