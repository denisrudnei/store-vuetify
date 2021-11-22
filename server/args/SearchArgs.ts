import { ArgsType, Field, Int } from 'type-graphql'

@ArgsType()
export class SearchArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  public page!: number

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  public limit!: number
}
