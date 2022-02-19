import { ObjectType } from 'type-graphql'
import { Product } from '../../../models/Product'
import { PaginatedEdge } from '../PaginatedEdge'

@ObjectType()
export class ProductNode extends PaginatedEdge(Product) {}
