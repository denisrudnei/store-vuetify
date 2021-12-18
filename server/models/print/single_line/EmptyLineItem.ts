import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
@ChildEntity()
export class EmptyLineItem extends SingleLineItemLayout {
  @Column({ default: PrintLayoutItemType.FILL_THE_LINE })
  public type: PrintLayoutItemType = PrintLayoutItemType.FILL_THE_LINE

  @Field()
  @Column({ type: 'int', default: 1 })
  public numberOfLines: number = 1
}
