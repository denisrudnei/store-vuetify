import { ObjectType, Field } from 'type-graphql'
import { SynchronizationItemResult } from '../models/SynchronizationItemResult'

@ObjectType()
export class SynchronizationResult {
  @Field(() => [SynchronizationItemResult])
  public products!: SynchronizationItemResult[]

  @Field(() => [SynchronizationItemResult])
  public users!: SynchronizationItemResult[]

  @Field(() => [SynchronizationItemResult])
  public categories!: SynchronizationItemResult[]

  @Field(() => [SynchronizationItemResult])
  public purchases!: SynchronizationItemResult[]
}
