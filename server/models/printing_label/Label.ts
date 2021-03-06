import { Field, ID, ObjectType, Float, Int } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { LabelItem } from './items/LabelItem'

@ObjectType()
@Entity()
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Field()
  @Column()
  public name!: String

  @Field(() => Float)
  @Column({ type: 'float' })
  public width!: number

  @Field(() => Float)
  @Column({ type: 'float' })
  public height!: number

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  public numberOfLabels!: number

  @Field(() => Float)
  @Column({ type: 'float', default: 3 })
  public spaceBetweenLabels!: number

  @OneToMany(() => LabelItem, (labelItem) => labelItem.label)
  @Field(() => [LabelItem])
  public items!: LabelItem[]
}
