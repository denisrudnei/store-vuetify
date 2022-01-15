import { Field, ObjectType } from 'type-graphql'
import { ChildEntity, Column } from 'typeorm'

import { DynamicTextType } from '../../../enums/printing_label/DynamicTextType'
import { LabelItem } from './LabelItem'

@ChildEntity()
@ObjectType({ implements: LabelItem })
export class DynamicTextLabelItem extends LabelItem {
  @Field(() => DynamicTextType)
  @Column()
  public type!: DynamicTextType
}
