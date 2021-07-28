import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class SummaryItem {
  @Field()
  public name!: string

  @Field(() => Int)
  public value!: number
}
