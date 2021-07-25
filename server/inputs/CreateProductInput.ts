import { Field, Float, InputType, ID } from 'type-graphql'
import { Category } from '../models/Category'

@InputType()
export class CreateProductInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => Float)
  public price!: number

  @Field(() => Float)
  public amount!: number

  @Field(() => ID)
  public category!: Category['id']
}
