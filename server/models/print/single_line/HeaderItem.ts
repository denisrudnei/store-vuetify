import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { PrintLayoutItemType } from '../PrintLayoutItemType'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@ChildEntity()
@ObjectType({ implements: [SingleLineItemLayout, PrintLayoutItem] })
export class HeaderItem extends SingleLineItemLayout {
  @Field(() => PrintLayoutItemType)
  public type: PrintLayoutItemType = PrintLayoutItemType.FILL_THE_LINE

  @Field()
  @Column()
  public storeName!: boolean

  @Field()
  @Column()
  public address!: boolean

  @Field()
  @Column()
  public cnpj!: boolean
}
