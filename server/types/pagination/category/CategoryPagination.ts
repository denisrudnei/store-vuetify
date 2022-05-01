import { Field, ObjectType } from 'type-graphql'
import { PaginatedResponse } from '~/server/types/pagination/PaginatedResponse'
import { CategoryNode } from '~/server/types/pagination/category/CategoryNode'

@ObjectType()
export class CategoryPagination extends PaginatedResponse() {
  @Field(() => [CategoryNode])
  public edges!: CategoryNode[]
}
