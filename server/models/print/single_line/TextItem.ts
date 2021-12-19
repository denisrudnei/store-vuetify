import { ObjectType } from 'type-graphql'
import { Entity } from 'typeorm'

import { PrintLayoutItem } from '../PrintLayoutItem'
import { SingleLineItemLayout } from './SingleLineItemLayout'

@Entity()
@ObjectType({ implements: [PrintLayoutItem, SingleLineItemLayout] })
export class TextItem extends SingleLineItemLayout {}
