import { Field, InterfaceType } from 'type-graphql'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'

@InterfaceType({ implements: PrintLayoutItem })
export abstract class SingleLineItemLayout extends PrintLayoutItem {
  @Field(() => PrintLayoutItemType)
  public type: PrintLayoutItemType = PrintLayoutItemType.FILL_THE_LINE
}
