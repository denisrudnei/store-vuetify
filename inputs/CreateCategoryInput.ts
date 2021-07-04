import { InputType, Field, ID } from 'type-graphql'
import { Category } from '../server/models/Category'

@InputType()
export class CreateCategoryInput {
  @Field()
  public name!: string

  @Field()
  public description!: string

  @Field(() => ID, { nullable: true })
  public father!: Category['id']
}
