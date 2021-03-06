import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { PaymentType } from '../enums/PaymentType'
import { Purchase } from './Purchase'

@ObjectType()
@Entity()
export class Payment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field(() => PaymentType)
  @Column({ type: 'varchar', default: PaymentType.MONEY })
  public type!: PaymentType

  @Field()
  @Column({ type: 'decimal' })
  public value!: number

  @Field()
  @Column({ type: 'decimal' })
  public paid!: number

  @Field()
  @Column({ type: 'decimal' })
  public change!: number

  @Field(() => Purchase)
  @ManyToOne(() => Purchase, (purchase) => purchase.payments)
  public purchase!: Purchase
}
