import { Query, Resolver } from 'type-graphql'
import { Category } from '../models/Category'

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  public GetCategories() {
    return Category.find()
  }
}
