import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Product } from './Product'
import { Purchase } from './Purchase'

@ObjectType()
@Entity()
export class HistoryProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @Column(() => Product)
  @Field(() => Product)
  public data!: Product

  @Field(() => ID)
  @Column({ type: 'int' })
  public productId!: number

  @ManyToOne(() => Purchase, (purchase) => purchase.products, {
    nullable: true,
  })
  @Field(() => Purchase, { nullable: true })
  public purchase?: Purchase
}
