import { ObjectType } from 'type-graphql'
import { PaginatedEdge } from '~/server/types/pagination/PaginatedEdge'
import { Category } from '~/server/models/Category'

@ObjectType()
export class CategoryNode extends PaginatedEdge(Category) {}
