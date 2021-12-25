import { InterfaceType } from 'type-graphql'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'

@InterfaceType({ implements: PrintLayoutItem })
export abstract class ColumnsItemLayout extends PrintLayoutItem {
  type: PrintLayoutItemType = PrintLayoutItemType.COLUMNS
}
