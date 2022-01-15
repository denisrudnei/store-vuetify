import { Field, ObjectType } from 'type-graphql'
import { Column, ChildEntity } from 'typeorm'

import { LabelFontSize } from '../../../enums/printing_label/LabelFontSize'
import { LabelItem } from './LabelItem'

@ChildEntity()
@ObjectType({ implements: LabelItem })
export class FixedTextLabelItem extends LabelItem {
  @Field()
  @Column()
  public text!: String

  @Field(() => LabelFontSize)
  @Column()
  public fontSize!: LabelFontSize
}
