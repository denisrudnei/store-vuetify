import { Field, ID, InputType } from 'type-graphql'

import { Address } from '../../models/Address'

@InputType()
export class CreateSupplierInput {
  @Field()
  public name!: string

  @Field()
  public cnpj!: string

  @Field({ nullable: true })
  public ie!: string

  @Field(() => ID, { nullable: true })
  public address!: Address['id']
}
