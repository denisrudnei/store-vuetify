import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class PaymentDescription {
  @Field()
  public text!: String

  @Field()
  public value!: String
}
