import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
@ChildEntity()
export class EmptyLineItem extends SingleLineItemLayout {
  @Field()
  @Column({ type: 'int', default: 1 })
  public numberOfLines: number = 1
}
