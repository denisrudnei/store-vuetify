import { Field, Float, ID, InputType } from 'type-graphql'

@InputType()
export class ProductForPurchaseInput {
  @Field(() => ID)
  public id!: number

  @Field(() => Float)
  public amount!: number
}
