import { Field, ID, InterfaceType } from 'type-graphql'
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  BaseEntity,
} from 'typeorm'

import { PrintLayout } from './PrintLayout'
import { PrintLayoutItemType } from './PrintLayoutItemType'

@InterfaceType()
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PrintLayoutItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Field(() => PrintLayout)
  @ManyToOne(() => PrintLayout, (mainLayout) => mainLayout.items)
  public mainLayout!: PrintLayout

  @Field(() => PrintLayoutItemType)
  @Column()
  public type!: PrintLayoutItemType
}
