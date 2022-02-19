import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Supplier } from './Supplier'
import { Product } from './Product'

@ObjectType()
@Entity()
export class PurchaseReceipt extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Field(() => Supplier)
  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseReceipts)
  public supplier!: Supplier

  @Field()
  public createdAt!: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date

  @Field(() => [Product])
  public products!: Product[]
}
