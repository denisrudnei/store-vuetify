import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { HistoryProduct } from './HistoryProduct'
import { User } from './User'

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number

  @OneToMany(() => HistoryProduct, (history) => history.order)
  @Field(() => [HistoryProduct])
  public products!: HistoryProduct[]

  @OneToMany(() => User, (user) => user.orders)
  @Field(() => User)
  public user!: User
}
