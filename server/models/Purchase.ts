import { Field, Float, ID, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DeliveryStatus } from '../enums/DeliveryStatus'
import { PurchaseOrigin } from '../enums/PurchaseOrigin'
import { PurchaseType } from '../enums/PurchaseType'
import { PaymentType } from '../enums/PaymentType'
import { EstablishmentTable } from './EstablishmentTable'
import { HistoryProduct } from './HistoryProduct'
import { Payment } from './Payment'
import { POS } from './POS'
import { User } from './User'

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

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.purchases, { nullable: true })
  public user?: User | null

  @Field(() => POS, { nullable: true })
  @ManyToOne(() => POS, (pos) => pos.purchases, { nullable: true })
  public pos?: POS

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.purchasesMade, { nullable: true })
  public operator?: User | null

  @Field(() => PurchaseOrigin)
  @Column({ default: PurchaseOrigin.ECOMMERCE, type: 'varchar' })
  public origin!: PurchaseOrigin

  @OneToMany(() => Payment, (payment) => payment.purchase)
  @Field(() => [Payment])
  @JoinColumn()
  public payments!: Payment[]

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
  public establishmentTable?: EstablishmentTable | null

  @Field(() => Int)
  public async totalAmount() {
    if (!this.products) {
      const purchase = (await Purchase.findOne({
        where: {
          id: this.id,
        },
        relations: ['products'],
      })) as Purchase
      this.products = purchase.products
    }

    return this.products.reduce((acc, actual) => {
      return (acc += Number(actual.data.amount))
    }, 0)
  }

  @Field(() => Payment)
  public async payment() {
    if (!this.payments) {
      const purchase = (await Purchase.findOne({
        where: {
          id: this.id,
        },
        relations: ['payments'],
      })) as Purchase
      this.payments = purchase.payments
    }
    return {
      id: 'grouped payment',
      type:
        this.payments.length > 0 ? this.payments[0].type : PaymentType.MONEY,
      value: this.payments.reduce((acc, value) => acc + Number(value.value), 0),
      change: this.payments.reduce(
        (acc, value) => acc + Number(value.change),
        0
      ),
      paid: this.payments.reduce((acc, value) => acc + Number(value.paid), 0),
    }
  }

  @Field(() => Float)
  public async totalPrice() {
    if (!this.products) {
      const purchase = (await Purchase.findOne({
        where: {
          id: this.id,
        },
        relations: ['products'],
      })) as Purchase
      this.products = purchase.products
    }
    return this.products.reduce((acc, actual) => {
      return (acc += Number(actual.data.amount) * Number(actual.data.price))
    }, 0)
  }
}
