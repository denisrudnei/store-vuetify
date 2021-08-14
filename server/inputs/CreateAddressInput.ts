import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateAddressInput {
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
