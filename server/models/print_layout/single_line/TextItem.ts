import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@Entity()
@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
export class TextItem extends SingleLineItemLayout {
  @Field()
  @Column()
  public text: string = ''
}
