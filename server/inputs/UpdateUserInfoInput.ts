import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateUserInfoInput {
  @Field()
  public name!: string
}
