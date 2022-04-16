import { Field, ID, Int, InterfaceType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm'

import { PrintLayout } from './PrintLayout'

@InterfaceType()
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class PrintLayoutItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Field(() => Int)
  @Column({ type: 'int', default: '1' })
  public position!: number

  @Field(() => PrintLayout)
  @ManyToOne(() => PrintLayout, (mainLayout) => mainLayout.items)
  public mainLayout!: PrintLayout

  @Field(() => String)
  @Column()
  public type!: String
}
