import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { PurchaseType } from '../../../enums/PurchaseType'
import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [SingleLineItemLayout, PrintLayoutItem] })
@ChildEntity()
export class ProductTable extends SingleLineItemLayout {
  @Field()
  @Column({ default: PurchaseType.NORMAL })
  public printType!: PurchaseType.NORMAL
}
