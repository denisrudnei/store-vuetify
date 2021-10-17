import { Field, Float, ID, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { PurchaseType } from '../enums/PurchaseType'
import { DeliveryStatus } from '../enums/DeliveryStatus'
import { HistoryProduct } from './HistoryProduct'
import { Payment } from './Payment'
import { User } from './User'
import { EstablishmentTable } from './EstablishmentTable'

@ObjectType()
@Entity()
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number

  @CreateDateColumn()
  @Field(() => Date)
  public createdAt!: Date

  @Field(() => [HistoryProduct])
  @OneToMany(() => HistoryProduct, (history) => history.purchase)
  public products!: HistoryProduct[]

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.purchases)
  public user!: User

  @OneToOne(() => Payment, (payment) => payment.purchase)
  @Field(() => Payment)
  @JoinColumn()
  public payment!: Payment

  @Field(() => PurchaseType)
  @Column({ type: 'varchar', default: PurchaseType.NORMAL })
  public type!: PurchaseType

  @Field(() => DeliveryStatus)
  @Column({ type: 'varchar', default: DeliveryStatus.REQUIRED })
  public status!: DeliveryStatus

  @Field(() => EstablishmentTable)
  @ManyToOne(() => EstablishmentTable, (table) => table.orders, {
    nullable: true,
  })
  public establishmentTable!: EstablishmentTable

  @Field(() => Int)
  public async totalAmount() {
    if (!this.products) {
      const purchase = (await Purchase.findOne(this.id, {
        relations: ['products'],
      })) as Purchase
      this.products = purchase.products
    }

    return this.products.reduce((acc, actual) => {
      return (acc += Number(actual.data.amount))
    }, 0)
  }

  @Field(() => Float)
  public async totalPrice() {
    if (!this.products) {
      const purchase = (await Purchase.findOne(this.id, {
        relations: ['products'],
      })) as Purchase
      this.products = purchase.products
    }
    return this.products.reduce((acc, actual) => {
      return (acc += Number(actual.data.amount) * Number(actual.data.price))
    }, 0)
  }
}
