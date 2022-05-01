import { ObjectType } from 'type-graphql'
import { PaginatedEdge } from '../PaginatedEdge'
import { Category } from '../../../models/Category'

@ObjectType()
export class CategoryNode extends PaginatedEdge(Category) {}
