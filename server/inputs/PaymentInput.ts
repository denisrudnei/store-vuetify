import { Field, InputType } from 'type-graphql'

import { PaymentType } from '../enums/PaymentType'

@InputType()
export class PaymentInput {
  @Field(() => PaymentType)
  public type!: PaymentType

  @Field()
  public value!: number

  @Field()
  public paid!: number
}
