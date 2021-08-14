import { Field, InputType, ID } from 'type-graphql'
import { Address } from '../models/Address'

@InputType()
export class UpdateAddressInput {
  @Field(() => ID)
  public id!: Address['id']

  @Field()
  public zipCode!: string

  @Field()
  public country!: string

  @Field()
  public city!: string

  @Field()
  public number!: string

  @Field()
  public street!: string

  @Field()
  public district!: string

  @Field()
  public state!: string
}
