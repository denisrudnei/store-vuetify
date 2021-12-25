import { ObjectType } from 'type-graphql'
import { ChildEntity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
@ChildEntity()
export class PurchaseInformation extends SingleLineItemLayout {
  type = 'PurchaseInformation'
}
