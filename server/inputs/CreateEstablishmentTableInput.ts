import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateEstablishmentTableInput {
  @Field()
  public name!: string
}
