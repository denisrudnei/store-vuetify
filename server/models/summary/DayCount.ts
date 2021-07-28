import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class DayCount {
  @Field()
  public day!: Date

  @Field(() => Int)
  public total!: number
}
