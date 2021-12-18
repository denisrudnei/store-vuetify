import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ChildEntity()
@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
export class PaymentInfoItem extends SingleLineItemLayout {
  @Field(() => PrintLayoutItemType)
  @Column({ default: PrintLayoutItemType.FILL_THE_LINE })
  public type: PrintLayoutItemType = PrintLayoutItemType.FILL_THE_LINE
}
