import { ObjectType } from 'type-graphql'

import { Supplier } from '../../../models/Supplier'
import { PaginatedEdge } from '../PaginatedEdge'

@ObjectType()
export class SupplierNode extends PaginatedEdge(Supplier) {}
