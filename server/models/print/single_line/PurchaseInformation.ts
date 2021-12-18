import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
@Entity()
export class PurchaseInformation extends SingleLineItemLayout {
  @Field(() => PrintLayoutItemType)
  @Column({ default: PrintLayoutItemType.FILL_THE_LINE })
  public type: PrintLayoutItemType = PrintLayoutItemType.FILL_THE_LINE
}
