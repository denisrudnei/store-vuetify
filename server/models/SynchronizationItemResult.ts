import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { SynchronizationItemType } from '../enums/SynchronizationItemType'
import { SynchronizationStatus } from '../enums/SynchronizationStatus'

@ObjectType()
@Entity()
export class SynchronizationItemResult extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Field(() => ID)
  @Column(() => Number)
  public itemId!: number | string

  @Field(() => SynchronizationStatus)
  @Column()
  public status!: SynchronizationStatus

  @Field(() => SynchronizationItemType)
  @Column()
  public type!: SynchronizationItemType

  @Field()
  @Column()
  public reason!: string

  @Field()
  @CreateDateColumn()
  public createdAt!: Date
}
