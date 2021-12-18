import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@Entity()
@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
export class TextItem extends SingleLineItemLayout {
  @Field(() => PrintLayoutItemType)
  @Column({ default: PrintLayoutItemType.FILL_THE_LINE })
  public type: PrintLayoutItemType = PrintLayoutItemType.FILL_THE_LINE
}
