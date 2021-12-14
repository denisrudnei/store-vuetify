import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SynchronizationItemResult } from './SynchronizationItemResult'

@ObjectType()
@Entity()
export class SynchronizationResult extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Field(() => [SynchronizationItemResult])
  @OneToMany(() => SynchronizationItemResult, (item) => item.synchronization)
  public products!: SynchronizationItemResult[]

  @Field(() => [SynchronizationItemResult])
  public users!: SynchronizationItemResult[]

  @Field(() => [SynchronizationItemResult])
  public categories!: SynchronizationItemResult[]

  @Field(() => [SynchronizationItemResult])
  public purchases!: SynchronizationItemResult[]
}
