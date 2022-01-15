import { Field, InputType } from 'type-graphql'

@InputType()
export class OriginPointInput {
  @Field()
  public x!: number

  @Field()
  public y!: number
}
