import { Field, InputType } from 'type-graphql'

import { SyncProductInput } from '../inputs/synchronize/SyncProductInput'
import { SyncPurchaseInput } from '../inputs/synchronize/SyncPurchaseInput'
import { Category } from '../models/Category'
import { User } from '../models/User'

@InputType()
export class LoadPayload {
  @Field(() => [SyncProductInput], { nullable: true })
  public products?: SyncProductInput[]

  public users?: User[]

  public categories?: Category[]

  @Field(() => [SyncPurchaseInput], { nullable: true })
  public purchases?: SyncProductInput[]
}
