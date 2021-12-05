import { Field, InputType, ID, Float } from 'type-graphql'
import { Category } from '../models/Category'
@InputType()
export class EditProductInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => [String])
  public type!: string[]

  @Field(() => ID)
  public category!: Category['id']

  @Field(() => Float)
  public price!: number

  @Field(() => Float)
  public amount!: number
}
