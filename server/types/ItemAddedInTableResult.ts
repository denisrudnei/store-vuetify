import { ObjectType, Field, ID } from 'type-graphql'
import { EstablishmentTable } from '../models/EstablishmentTable'
import { HistoryProduct } from '../models/HistoryProduct'

@ObjectType()
export class ItemAddedInTableResult {
  @Field(() => ID)
  public tableId!: EstablishmentTable['id']

  @Field(() => HistoryProduct)
  public product!: HistoryProduct
}
