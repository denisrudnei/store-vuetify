import { Field, ObjectType } from 'type-graphql'

import { PaginatedResponse } from '../PaginatedResponse'
import { PurchaseReceiptNode } from './PurchaseReceiptNode'

@ObjectType()
export class PurchaseReceiptPagination extends PaginatedResponse() {
  @Field(() => [PurchaseReceiptNode])
  public edges!: PurchaseReceiptNode[]
}
