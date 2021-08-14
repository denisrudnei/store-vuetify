import { Field, InputType } from 'type-graphql'

@InputType()
export class CreatePhoneInput {
  @Field()
  public description!: string

  @Field()
  public number!: string
}
