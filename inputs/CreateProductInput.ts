import { Field, Float, InputType, ID } from 'type-graphql'
import { Category } from '../server/models/Category'

@InputType()
export class CreateProductInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => Float)
  public price!: number

  @Field(() => ID)
  public category!: Category['id']
}
