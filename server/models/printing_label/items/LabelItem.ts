import {
  BaseEntity,
  TableInheritance,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  Column,
} from 'typeorm'

import { InterfaceType, ID, Field } from 'type-graphql'
import { OriginPoint } from '../OriginPoint'
import { Label } from '../Label'
import { LabelItemRotation } from '../../../enums/printing_label/LabelItemRotation'

@InterfaceType()
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'columnType' } })
export abstract class LabelItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  public id!: string

  @Field(() => Label)
  @ManyToOne(() => Label, (label) => label.items)
  public label!: Label

  @Field()
  public name!: String

  @Field(() => OriginPoint)
  @OneToOne(() => OriginPoint, (origin) => origin.labelItem)
  public origin!: OriginPoint

  @Field(() => LabelItemRotation)
  @Column({ default: LabelItemRotation.normal })
  public rotation!: LabelItemRotation

  @Field()
  @Column()
  public columnType!: string
}
