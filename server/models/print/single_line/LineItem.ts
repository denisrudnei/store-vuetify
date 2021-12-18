import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
@ChildEntity()
export class LineItem extends SingleLineItemLayout {
  @Field()
  @Column()
  public character!: string
}
