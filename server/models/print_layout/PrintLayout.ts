import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PrintLayoutItem } from './PrintLayoutItem'

@ObjectType()
@Entity()
export class PrintLayout extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Column()
  @Field()
  public name!: string

  @OneToMany(() => PrintLayoutItem, (item) => item.mainLayout)
  @Field(() => [PrintLayoutItem])
  public items!: PrintLayoutItem[]

  @Field()
  @CreateDateColumn()
  public createdAt!: Date

  @Field({ nullable: true })
  @UpdateDateColumn()
  public updatedAt?: Date

  @Field({ nullable: true })
  @DeleteDateColumn()
  public deletedAt?: Date
}
