import { Field, InputType } from 'type-graphql'

@InputType()
export class CreatePOSInput {
  @Field()
  public name!: string
}
