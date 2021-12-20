import { ObjectType } from 'type-graphql'
import { Entity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
@Entity()
export class PurchaseInformation extends SingleLineItemLayout {
  type = 'PurchaseInformation'
}
