import { ObjectType, Field } from 'type-graphql'

import { PaginatedResponse } from '../PaginatedResponse'
import { SupplierNode } from './SupplierNode'

@ObjectType()
export class SupplierConnection extends PaginatedResponse() {
  @Field(() => [SupplierNode])
  public edges!: SupplierNode[]
}
