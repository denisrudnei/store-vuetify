import { InputType, Field } from 'type-graphql'

@InputType()
export class CreatePrintLayoutInput {
  @Field()
  public name!: string
}
