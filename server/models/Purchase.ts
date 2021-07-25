import { Field, ID, Int, ObjectType, Float } from 'type-graphql'
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { HistoryProduct } from './HistoryProduct'
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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.purchases)
  public user!: User

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
