import { InterfaceType } from 'type-graphql'

import { PrintLayoutItem } from '../PrintLayoutItem'

@InterfaceType({ implements: PrintLayoutItem })
export abstract class SingleLineItemLayout extends PrintLayoutItem {}
