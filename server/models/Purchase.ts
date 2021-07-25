import { Field, ID, ObjectType } from 'type-graphql'
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
}
