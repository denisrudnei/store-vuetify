import { ObjectType } from 'type-graphql'
import { ChildEntity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ChildEntity()
@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
export class PaymentInfoItem extends SingleLineItemLayout {
  type = 'PaymentInfoItem'
}
