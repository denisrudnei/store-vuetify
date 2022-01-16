import { ObjectType, Field } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { LabelItem } from './LabelItem'

@ChildEntity()
@ObjectType({ implements: LabelItem })
export class BarcodeLabelItem extends LabelItem {
  @Field()
  @Column()
  public showNumbers!: boolean
}
