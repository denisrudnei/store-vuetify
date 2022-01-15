import { InputType, Field, Float } from 'type-graphql'

@InputType()
export class CreateLabelInput {
  @Field()
  public name!: String

  @Field(() => Float)
  public width!: number

  @Field(() => Float)
  public height!: number
}
