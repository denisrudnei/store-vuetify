import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Purchase } from './Purchase'

@Entity()
@ObjectType()
export class EstablishmentTable extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id!: number

  @Field()
  @Column()
  public name!: string

  @Field()
  @Column({ default: false })
  public inUse!: boolean

  @Field(() => Purchase, { nullable: true })
  @OneToOne(() => Purchase, (order) => order.establishmentTable, {
    nullable: true,
  })
  @JoinColumn()
  public activeOrder!: Purchase | undefined

  @OneToMany(() => Purchase, (purchase) => purchase.establishmentTable)
  @Field(() => [Purchase])
  public orders!: Purchase[]

  @DeleteDateColumn()
  public deletedAt?: Date
}
