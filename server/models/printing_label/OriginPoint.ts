import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { LabelItem } from './items/LabelItem'

@ObjectType()
@Entity()
export class OriginPoint extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @OneToOne(() => LabelItem, (item) => item.origin, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Field(() => LabelItem)
  public labelItem!: LabelItem

  @Field()
  @Column()
  public x!: number

  @Field()
  @Column()
  public y!: number
}
