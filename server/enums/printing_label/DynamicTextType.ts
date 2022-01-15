import { registerEnumType } from 'type-graphql'

export enum DynamicTextType {
  name = 'name',
  description = 'description',
  barcode = 'barcode',
  price = 'price',
  amount = 'amount',
  createdAt = 'createdAt',
  actualDate = 'actualDate',
}

registerEnumType(DynamicTextType, {
  name: 'DynamicTextType',
})
