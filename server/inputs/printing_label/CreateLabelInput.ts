import { InputType, Field, Float, Int } from 'type-graphql'

@InputType()
export class CreateLabelInput {
  @Field()
  public name!: String

  @Field(() => Float)
  public width!: number

  @Field(() => Float)
  public height!: number

  @Field(() => Int, { defaultValue: 1, nullable: true })
  public numberOfLabels!: number

  @Field(() => Float, { nullable: true, defaultValue: 3 })
  public spaceBetweenLabels!: number
}
