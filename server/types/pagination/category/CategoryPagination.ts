import { Field, ObjectType } from 'type-graphql'
import { PaginatedResponse } from '../PaginatedResponse'
import { CategoryNode } from './CategoryNode'

@ObjectType()
export class CategoryPagination extends PaginatedResponse() {
  @Field(() => [CategoryNode])
  public edges!: CategoryNode[]
}
