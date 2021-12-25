import { InputType, Field, ID } from 'type-graphql'
import { Purchase } from '../../models/Purchase'
import { PurchaseOrigin } from '../../enums/PurchaseOrigin'
import { POS } from '../../models/POS'
import { User } from '~/server/models/User'

@InputType()
export class SyncPurchaseInput {
  @Field(() => ID)
  public id!: Purchase['id']

  @Field(() => ID)
  public pos!: POS['id']

  @Field(() => ID)
  public operator!: User['id']

  @Field(() => ID, { nullable: true })
  public user?: User['id']

  @Field(() => PurchaseOrigin)
  public origin!: PurchaseOrigin
}
